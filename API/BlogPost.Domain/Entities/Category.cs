    namespace BlogPost.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string UrlHandle { get; set; } = string.Empty;

        public ICollection<Blog> blogs { get; set; }

    }
}
