using System.IO;
using System.Threading.Tasks;

namespace BlogPost.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<string> UploadAsync(Stream fileStream, string fileName, string fileExtension);
    }
}

