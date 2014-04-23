using ClientArchitecture.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ClientArchitecture.Controllers
{
    public class AppController : ApiController
    {
        // GET api/app
        public IEnumerable<ApplicationModel> Get()
        {
            return new ApplicationModel[] { 
                //new ApplicationModel() { 
                //PreviewUrl = "Content/TestApp/preview.html",
                //AppUrl = "Content/TestApp/index.html"
            //},
            new ApplicationModel() { 
                PreviewUrl = "Content/TestApp/preview.html",
                AppUrl = "http://localhost:100/Content/Projects/Asteroid/Index.html"
            }};
        }

        // GET api/app/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/app
        public void Post([FromBody]string value)
        {
        }

        // PUT api/app/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/app/5
        public void Delete(int id)
        {
        }
    }
}
