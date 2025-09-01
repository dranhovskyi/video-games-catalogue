using AutoFixture;
using Microsoft.EntityFrameworkCore;
using VideoGamesCatalogue.Server.Data;
using VideoGamesCatalogue.Server.DTOs;
using VideoGamesCatalogue.Server.Models;
using VideoGamesCatalogue.Server.Services;

namespace VideoGamesCatalogue.Server.UnitTests.Services
{
    [TestFixture]
    public class VideoGameServiceTests
    {
        private VideoGameContext _context;
        private VideoGameService _service;
        private IFixture _fixture;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<VideoGameContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new VideoGameContext(options);
            _service = new VideoGameService(_context);
            _fixture = new Fixture();
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetAllAsync_ReturnsAllVideoGames()
        {
            // Arrange
            var videoGames = _fixture.CreateMany<VideoGame>(3).ToList();
            _context.VideoGames.AddRange(videoGames);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.That(result.Count(), Is.EqualTo(3));
        }

        [Test]
        public async Task GetByIdAsync_ExistingId_ReturnsVideoGame()
        {
            // Arrange
            var videoGame = _fixture.Create<VideoGame>();
            _context.VideoGames.Add(videoGame);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetByIdAsync(videoGame.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(videoGame.Id));
        }

        [Test]
        public async Task GetByIdAsync_NonExistingId_ReturnsNull()
        {
            // Act
            var result = await _service.GetByIdAsync(999);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task CreateAsync_ValidDto_ReturnsCreatedVideoGame()
        {
            // Arrange
            var createDto = _fixture.Create<CreateVideoGameDto>();

            // Act
            var result = await _service.CreateAsync(createDto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo(createDto.Title));

            var savedGame = await _context.VideoGames.FindAsync(result.Id);
            Assert.That(savedGame, Is.Not.Null);
        }

        [Test]
        public async Task UpdateAsync_ExistingId_ReturnsUpdatedVideoGame()
        {
            // Arrange
            var videoGame = _fixture.Create<VideoGame>();
            _context.VideoGames.Add(videoGame);
            await _context.SaveChangesAsync();

            var updateDto = _fixture.Create<UpdateVideoGameDto>();

            // Act
            var result = await _service.UpdateAsync(videoGame.Id, updateDto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo(updateDto.Title));
        }

        [Test]
        public async Task DeleteAsync_ExistingId_ReturnsTrue()
        {
            // Arrange
            var videoGame = _fixture.Create<VideoGame>();
            _context.VideoGames.Add(videoGame);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeleteAsync(videoGame.Id);

            // Assert
            Assert.That(result, Is.True);

            var deletedGame = await _context.VideoGames.FindAsync(videoGame.Id);
            Assert.That(deletedGame, Is.Null);
        }
    }
}