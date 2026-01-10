namespace SimpleNotes.Api.Exceptions
{
    public class InvalidActionException : AppException
    {
        private static readonly string DEFAULT_CODE = "InvalidAction";
        public InvalidActionException(string code, string? message)
           : base(code + DEFAULT_CODE, message)
        {
        }
    }
}
