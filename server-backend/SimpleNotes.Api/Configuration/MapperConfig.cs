using AutoMapper;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.DTOs;

namespace SimpleNotes.Api.Configuration
{
    public class MapperConfig : Profile
    {
        public MapperConfig()
        {
            CreateMap<User, UserReadOnlyDTO>()
                .ForMember(d => d.UserRole, opt => opt.MapFrom(s => s.UserRole.ToString()));
            CreateMap<UserSignupDTO, User>()
                .ForMember(d => d.PasswordHash, opt => opt.Ignore())
                .ForMember(d => d.UserRole, opt => opt.Ignore())
                .ForMember(d => d.Notes, opt => opt.Ignore())
                .ForMember(d => d.InsertedAt, opt => opt.Ignore())
                .ForMember(d => d.ModifiedAt, opt => opt.Ignore())
                .ForMember(d => d.IsDeleted, opt => opt.Ignore())
                .ForMember(d => d.DeletedAt, opt => opt.Ignore());
            CreateMap<Note, NoteDTO>()
                .ForMember(d => d.TimeStamp, opt => opt.MapFrom(s => s.ModifiedAt));
            CreateMap<AddNoteDTO, Note>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.UserId, opt => opt.Ignore())
                .ForMember(d => d.User, opt => opt.Ignore())
                .ForMember(d => d.InsertedAt, opt => opt.Ignore())
                .ForMember(d => d.ModifiedAt, opt => opt.Ignore())
                .ForMember(d => d.IsDeleted, opt => opt.Ignore())
                .ForMember(d => d.DeletedAt, opt => opt.Ignore());
            CreateMap<UpdateNoteDTO, Note>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.UserId, opt => opt.Ignore())
                .ForMember(d => d.User, opt => opt.Ignore())
                .ForMember(d => d.InsertedAt, opt => opt.Ignore())
                .ForMember(d => d.ModifiedAt, opt => opt.Ignore())
                .ForMember(d => d.IsDeleted, opt => opt.Ignore())
                .ForMember(d => d.DeletedAt, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}