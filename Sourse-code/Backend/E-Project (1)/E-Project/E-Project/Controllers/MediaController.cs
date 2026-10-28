using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace E_Project.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

        [HttpPost]
        public IActionResult UploadFile(IFormFile ImagePath)
        {
            if (ImagePath == null || ImagePath.Length == 0)
            {
                return BadRequest("Please select a file.");
            }

            // Size limit validation (reject anything over 5MB)
            if (ImagePath.Length > MaxFileSizeBytes)
            {
                return BadRequest("File size exceeds 5MB limit.");
            }

            // Extension validation
            var extension = Path.GetExtension(ImagePath.FileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
            {
                return BadRequest("Invalid file type. Allowed image formats: .jpg, .jpeg, .png, .webp, .gif");
            }

            // MIME type validation
            if (string.IsNullOrEmpty(ImagePath.ContentType) ||
                !ImagePath.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid content type. Only image files are allowed.");
            }

            string uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "upload"
            );

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            string uniqueFileName =
                $"{Guid.NewGuid()}_{Path.GetFileName(ImagePath.FileName)}";

            string filePath = Path.Combine(uploadFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                ImagePath.CopyTo(fileStream);
            }

            return Ok(new
            {
                fileName = uniqueFileName,
                message = "File uploaded successfully!"
            });
        }
    }
}