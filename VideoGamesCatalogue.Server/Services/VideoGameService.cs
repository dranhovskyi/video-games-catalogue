using Microsoft.EntityFrameworkCore;
using VideoGamesCatalogue.Server.Data;
using VideoGamesCatalogue.Server.DTOs;
using VideoGamesCatalogue.Server.Models;
using VideoGamesCatalogue.Server.Services.Interfaces;

namespace VideoGamesCatalogue.Server.Services
{
    public class VideoGameService : IVideoGameService
    {
        private readonly VideoGameContext _context;

        public VideoGameService(VideoGameContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VideoGameDto>> GetAllAsync()
        {
            var videoGames = await _context.VideoGames
                .OrderBy(vg => vg.Title)
                .ToListAsync();

            return videoGames.Select(MapToDto);
        }

        public async Task<VideoGameDto?> GetByIdAsync(int id)
        {
            var videoGame = await _context.VideoGames.FindAsync(id);
            return videoGame == null ? null : MapToDto(videoGame);
        }

        public async Task<VideoGameDto> CreateAsync(CreateVideoGameDto createDto)
        {
            var videoGame = new VideoGame
            {
                Title = createDto.Title,
                Genre = createDto.Genre,
                Platform = createDto.Platform,
                ReleaseDate = createDto.ReleaseDate,
                Developer = createDto.Developer,
                Publisher = createDto.Publisher,
                Rating = createDto.Rating,
                Description = createDto.Description
            };

            _context.VideoGames.Add(videoGame);
            await _context.SaveChangesAsync();

            return MapToDto(videoGame);
        }

        public async Task<VideoGameDto?> UpdateAsync(int id, UpdateVideoGameDto updateDto)
        {
            var videoGame = await _context.VideoGames.FindAsync(id);
            if (videoGame == null) return null;

            videoGame.Title = updateDto.Title;
            videoGame.Genre = updateDto.Genre;
            videoGame.Platform = updateDto.Platform;
            videoGame.ReleaseDate = updateDto.ReleaseDate;
            videoGame.Developer = updateDto.Developer;
            videoGame.Publisher = updateDto.Publisher;
            videoGame.Rating = updateDto.Rating;
            videoGame.Description = updateDto.Description;

            await _context.SaveChangesAsync();
            return MapToDto(videoGame);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var videoGame = await _context.VideoGames.FindAsync(id);
            if (videoGame == null) return false;

            _context.VideoGames.Remove(videoGame);
            await _context.SaveChangesAsync();
            return true;
        }

        private static VideoGameDto MapToDto(VideoGame videoGame)
        {
            return new VideoGameDto
            {
                Id = videoGame.Id,
                Title = videoGame.Title,
                Genre = videoGame.Genre,
                Platform = videoGame.Platform,
                ReleaseDate = videoGame.ReleaseDate,
                Developer = videoGame.Developer,
                Publisher = videoGame.Publisher,
                Rating = videoGame.Rating,
                Description = videoGame.Description
            };
        }
    }
}