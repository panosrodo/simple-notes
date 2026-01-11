using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SimpleNotes.Api.Data;

namespace SimpleNotes.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public abstract class BaseController : ControllerBase
    {
        protected readonly AppDBContext Db;
        protected readonly IMapper Mapper;

        protected BaseController(AppDBContext db, IMapper mapper)
        {
            Db = db;
            Mapper = mapper;
        }
    }
}