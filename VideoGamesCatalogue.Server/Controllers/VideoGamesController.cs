using Microsoft.AspNetCore.Mvc;
using VideoGamesCatalogue.Server.DTOs;
using VideoGamesCatalogue.Server.Services.Interfaces;

namespace VideoGamesCatalogue.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoGamesController : ControllerBase
    {
        private readonly IVideoGameService _videoGameService;

        public VideoGamesController(IVideoGameService videoGameService)
        {
            _videoGameService = videoGameService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VideoGameDto>>> GetAll()
        {
            var videoGames = await _videoGameService.GetAllAsync();
            return Ok(videoGames);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VideoGameDto>> GetById(int id)
        {
            var videoGame = await _videoGameService.GetByIdAsync(id);
            if (videoGame == null)
                return NotFound();

            return Ok(videoGame);
        }

        [HttpPost]
        public async Task<ActionResult<VideoGameDto>> Create(CreateVideoGameDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var videoGame = await _videoGameService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = videoGame.Id }, videoGame);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<VideoGameDto>> Update(int id, UpdateVideoGameDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var videoGame = await _videoGameService.UpdateAsync(id, updateDto);
            if (videoGame == null)
                return NotFound();

            return Ok(videoGame);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _videoGameService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}