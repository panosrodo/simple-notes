using Microsoft.AspNetCore.Mvc;
using SimpleNotes.Api.Exceptions;
using System.Text.Json;

namespace SimpleNotes.Api.Middleware;

/// <summary>
/// Global error handling middleware.
/// Catches unhandled exceptions and maps them to HTTP responses
/// using ProblemDetails for consistent API error output.
/// </summary>
public sealed class ErrorHandlerMiddleware : IMiddleware
{
    private readonly ILogger<ErrorHandlerMiddleware> _logger;

    public ErrorHandlerMiddleware(ILogger<ErrorHandlerMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            // Continue request pipeline
            await next(context);
        }
        catch (Exception ex)
        {
            // Log once, centrally (no try/catch in controllers)
            _logger.LogError(ex,
                "Unhandled exception at {Method} {Path} | TraceId={TraceId}",
                context.Request.Method,
                context.Request.Path.Value,
                context.TraceIdentifier);

            // Map exception type to HTTP status & title
            var (status, title) = MapStatus(ex);

            // Standard RFC 7807 response
            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = ex.Message,
                Instance = context.Request.Path
            };

            // Extra metadata for debugging / clients
            problem.Extensions["traceId"] = context.TraceIdentifier;

            // Include application-specific error code when available
            problem.Extensions["code"] = ex is AppException appEx
                ? appEx.Code
                : "UnhandledError";

            context.Response.Clear();
            context.Response.StatusCode = status;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
        }
    }

    /// <summary>
    /// Maps known application exceptions to HTTP status codes.
    /// </summary>
    private static (int Status, string Title) MapStatus(Exception ex) =>
        ex switch
        {
            // 400 - Client errors
            InvalidRegistrationException => (StatusCodes.Status400BadRequest, "Invalid registration"),
            InvalidActionException => (StatusCodes.Status400BadRequest, "Invalid action"),
            InvalidArgumentException => (StatusCodes.Status400BadRequest, "Invalid argument"),

            // 401 / 403 - Authorization
            EntityNotAuthorizedException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            EntityForbiddenException => (StatusCodes.Status403Forbidden, "Forbidden"),

            // 404 / 409 - Resource state
            EntityNotFoundException => (StatusCodes.Status404NotFound, "Not found"),
            EntityAlreadyExistsException => (StatusCodes.Status409Conflict, "Already exists"),

            // Generic application error
            AppException => (StatusCodes.Status400BadRequest, "Application error"),

            // 500 - Unexpected
            _ => (StatusCodes.Status500InternalServerError, "Unexpected error")
        };
}