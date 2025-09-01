namespace VideoGamesCatalogue.Server.DTOs;

public class UpdateVideoGameDto
{
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string Developer { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public string Description { get; set; } = string.Empty;
}