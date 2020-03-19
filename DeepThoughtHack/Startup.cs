using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DeepThoughtHack.Startup))]
namespace DeepThoughtHack
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
