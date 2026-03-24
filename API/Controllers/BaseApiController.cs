using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;

[Route("api/[controller]")] // localhost:api/members
[ApiController]

public class BaseApiController() : ControllerBase
{
}