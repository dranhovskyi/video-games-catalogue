using System.ComponentModel.DataAnnotations;

namespace VideoGamesCatalogue.Server.Models
{
    public class VideoGame
    {
        public int Id { get; set; }

        [Required] 
        [StringLength(100)] 
        public string Title { get; set; } = string.Empty;

        [StringLength(50)] 
        public string Genre { get; set; } = string.Empty;

        [StringLength(50)] 
        public string Platform { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        [StringLength(50)] 
        public string Developer { get; set; } = string.Empty;

        [StringLength(50)] 
        public string Publisher { get; set; } = string.Empty;

        [Range(0, 10)] 
        public decimal Rating { get; set; }

        [StringLength(500)] 
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}