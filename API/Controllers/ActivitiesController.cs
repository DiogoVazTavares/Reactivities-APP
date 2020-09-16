using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class ActivitiesController : BaseController
  {

    [HttpGet]
    public async Task<ActionResult<List<ActivityDto>>> List()
    {
      return await Mediator.Send(new List.Query());
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<ActivityDto>> Details(Guid id)
    {
      return await Mediator.Send(new Details.Query { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {

      //We would have to validate the model state to dicide if we need to throw an error or if it's good to go
      //we would do this before the [ApiController] exits, and of course if we dicide to not use it
      // if (!ModelState.IsValid)
      // {
      //   return BadRequest(ModelState);
      // }

      return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
    {
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await Mediator.Send(new Delete.Command { Id = id });
    }

    [HttpPost("{id}/attend")]
    public async Task<ActionResult<Unit>> Attend(Guid id)
    {

      return await Mediator.Send(new Attend.Command { Id = id });
    }

    [HttpDelete("{id}/attend")]
    public async Task<ActionResult<Unit>> Unattend(Guid id)
    {

      return await Mediator.Send(new Unattend.Command { Id = id });
    }
  }
}