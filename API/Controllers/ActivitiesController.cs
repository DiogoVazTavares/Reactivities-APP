using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  //When we use DataAnotations, see create activity in Application proj, this [ApiController] will
  //autimaticly throw HTTP errors according with the attributes you especified 
  //When can remove, but that means we should do the validation manualy 
  //another good thing this attribute gives us, is the binding source parameter inference
  //this tries to bind the data to the overoad on the endpoints. It tries to doing by inference
  [ApiController]
  public class ActivitiesController : ControllerBase
  {
    private readonly IMediator _mediator;
    public ActivitiesController(IMediator mediator)
    {
      _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<Activity>>> List()
    {
      return await _mediator.Send(new List.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> Details(Guid id)
    {
      return await _mediator.Send(new Details.Query { Id = id });
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

      return await _mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
    {
      command.Id = id;
      return await _mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await _mediator.Send(new Delete.Command { Id = id });
    }
  }
}