using System.IO;

namespace BlogPost.Application.DTOs.BlogImage
{
    public class UploadImageDto
    {
        public Stream FileStream { get; set; } = Stream.Null;
        public string FileName { get; set; } = string.Empty;
        public string FileExtension { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
    }
}

