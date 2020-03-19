using System.Web.Mvc;

namespace DeepThoughtHack.Controllers
{
    public class DashboardController : Controller
    {
        //private ApplicationSignInManager _signInManager;
        //private ApplicationUserManager _userManager;

        public DashboardController()
        {

        }

        public ActionResult Dashboard()
        {
            ViewBag.Message = "The Dashboard.";

            return View();
        }

    }
}