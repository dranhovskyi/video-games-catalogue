using VideoGamesCatalogue.Server.DTOs;

namespace VideoGamesCatalogue.Server.Services.Interfaces;

public interface IVideoGameService
{
    Task<IEnumerable<VideoGameDto>> GetAllAsync();
    Task<VideoGameDto?> GetByIdAsync(int id);
    Task<VideoGameDto> CreateAsync(CreateVideoGameDto createDto);
    Task<VideoGameDto?> UpdateAsync(int id, UpdateVideoGameDto updateDto);
    Task<bool> DeleteAsync(int id);
}