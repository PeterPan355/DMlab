using System.Web.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using DmLaboratorij_1.Models;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using System.Collections.Generic;

namespace DmLaboratorij_1.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class GenresController : ApiController
    {
        //tadaaa
       //DAA



        [HttpGet]
        [Route("api/Genres/{genre_id}")]
        [ResponseType(typeof(GenresModel))]
        public async Task<GenresModel> Get(string genre_ID)
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");
            string genre_id =  genre_ID;

            GenresModel genre = new GenresModel();
            var collection = mongoDbServer.GetCollection<BsonDocument>("Genres");
            var filter = Builders<BsonDocument>.Filter.Eq("genre_id", genre_id);
            var result = await collection.Find(filter).ToListAsync();
            foreach (BsonDocument item in result)
            {
                genre.genre_id = item.GetElement("genre_id").Value.ToString();
                genre.genre_type = item.GetElement("genre_type").Value.ToString();


            }
            var json = new JavaScriptSerializer().Serialize(genre);
            return genre;
        }

        [HttpGet]
        [Route("api/Genres/")]
        public async Task<List<GenresModel>> Get()
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");

            
            var collection = mongoDbServer.GetCollection<BsonDocument>("Genres");
            var filter = new BsonDocument();
            var result = await collection.Find(filter).ToListAsync();
            List<GenresModel> listOfGenres = new List<GenresModel>();
            foreach (BsonDocument item in result)
            {
                GenresModel genre = new GenresModel();
                genre.genre_id = item.GetElement("genre_ID").Value.ToString();
                genre.genre_type = item.GetElement("genre_type").Value.ToString();
                listOfGenres.Add(genre);
            }
            var json = new JavaScriptSerializer().Serialize(listOfGenres);
            return listOfGenres;
        }

        // POST api/values
        [HttpPost]
        [Route("api/Genres/")]
        public void Post(GenresModel model)
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");

            var document = new BsonDocument
            {
                { "genre_ID", model.genre_id  },
                { "genre_type",model.genre_type },
            };

            var collection = mongoDbServer.GetCollection<BsonDocument>("Genres");
            collection.InsertOneAsync(document);

        }    
    }
}
