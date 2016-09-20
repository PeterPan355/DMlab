
using System.Collections.Generic;

namespace DmLaboratorij_1.Models
{
    public class UserModel
    {
        public object _id { get; set; } //MongoDb uses this field as identity.

        public string Facebook_ID { get; set; }

        public string Ime { get; set; }

        public string Prezime { get; set; }

        public string Email { get; set; }

        public string DatumRodjenja { get; set; }

        public string Hometown { get; set; }

        public string ProfilePictureLink { get; set; }

        public object Movies { get; set; }
    }

    public class Movie
    {
        public string Title { get; set; }
    }
}