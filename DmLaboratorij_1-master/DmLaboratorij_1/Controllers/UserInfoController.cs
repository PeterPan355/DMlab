using System.Collections.Generic;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using System.Runtime.Serialization.Json;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using DmLaboratorij_1.Models;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace DmLaboratorij_1.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserInfoController : ApiController
    {
        [HttpGet]
        [Route("api/UserInfo/{Facebook_ID}")]
        [ResponseType(typeof(UserModel))]
        public async Task<UserModel> Get(string Facebook_ID)
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");
            string facebookID = '"' + Facebook_ID + '"';

            UserModel user = new UserModel();
            int i = 0;
            var collection = mongoDbServer.GetCollection<BsonDocument>("UserInfo");
            var filter = Builders<BsonDocument>.Filter.Eq("Facebook_ID", facebookID);
            var result = await collection.Find(filter).ToListAsync();
            foreach (BsonDocument item in result)
            {
                user.Facebook_ID = item.GetElement("Facebook_ID").Value.ToString();
                user.Ime = item.GetElement("Ime").Value.ToString();
                user.Prezime = item.GetElement("Prezime").Value.ToString();
                user.Email = item.GetElement("Email").Value.ToString();
                user.DatumRodjenja = item.GetElement("DatumRodjenja").Value.ToString();
                user.Hometown = item.GetElement("Hometown").Value.ToString();
                user.ProfilePictureLink = item.GetElement("ProfilePictureLink").Value.ToString();
              //  foreach (var movie in item.GetElement("Movies").Value.AsBsonArray)
              //  {
              //      user.Movies[i] = movie.ToString();
              //      i++;
              //  }
                i = 0;
                user._id = item.GetElement("_id").Value.ToString();

            }
            var json = new JavaScriptSerializer().Serialize(user);
            return user;
        }

        // POST api/values
        [HttpPost]
        public void Post(UserModel model)
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");
            BsonArray arr = new BsonArray();            
            dynamic jobj = JsonConvert.DeserializeObject<dynamic>(model.Movies.ToString());
            foreach (var item in jobj)
            {
                foreach(var subitem in item)
                {
                    arr.Add(subitem.Title.ToString());
                }
            }

            var document = new BsonDocument
            {
                { "Facebook_ID",  model.Facebook_ID },
                { "Ime",  model.Ime  },
                { "Prezime",  model.Prezime  },
                { "Email",  model.Email  },
                { "DatumRodjenja",  model.DatumRodjenja  },
                { "Hometown", model.Hometown},
                { "ProfilePictureLink", model.ProfilePictureLink  },
                { "Movies",  arr },
            };

            var collection = mongoDbServer.GetCollection<BsonDocument>("UserInfo");
            collection.InsertOneAsync(document);
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

    }
}
