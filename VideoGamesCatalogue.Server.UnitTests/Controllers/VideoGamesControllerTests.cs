using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using Moq;
using VideoGamesCatalogue.Server.Controllers;
using VideoGamesCatalogue.Server.DTOs;
using VideoGamesCatalogue.Server.Services.Interfaces;

namespace VideoGamesCatalogue.Server.UnitTests.Controllers
{
    [TestFixture]
    public class VideoGamesControllerTests
    {
        private Mock<IVideoGameService> _mockService;
        private VideoGamesController _controller;
        private Fixture _fixture;

        [SetUp]
        public void Setup()
        {
            _mockService = new Mock<IVideoGameService>();
            _controller = new VideoGamesController(_mockService.Object);
            _fixture = new Fixture();
        }

        [Test]
        public async Task GetAll_ReturnsOkWithVideoGames()
        {
            // Arrange
            var videoGames = _fixture.CreateMany<VideoGameDto>(3);
            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(videoGames);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public async Task GetById_ExistingId_ReturnsOkWithVideoGame()
        {
            // Arrange
            var videoGame = _fixture.Create<VideoGameDto>();
            _mockService.Setup(s => s.GetByIdAsync(videoGame.Id)).ReturnsAsync(videoGame);

            // Act
            var result = await _controller.GetById(videoGame.Id);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.GetByIdAsync(999)).ReturnsAsync((VideoGameDto?)null);

            // Act
            var result = await _controller.GetById(999);

            // Assert
            Assert.That(result.Result, Is.TypeOf<NotFoundResult>());
        }
    }
}