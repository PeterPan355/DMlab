

namespace DmLaboratorij_1.Models
{
    public class MovieModel
    {
        public object _id { get; set; } //MongoDb uses this field as identity.

        public string themoviedb_id { get; set; }

        public string original_title { get; set; }

        public string overview { get; set; }

        public string release_date { get; set; }

        public float vote_average { get; set; }

        public string cast { get; set; }

        public string crew { get; set; }

        public string trailer { get; set; }

        public string poster_url { get; set; }

        public object genreIDs { get; set; }

    }
}
