using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Unattend
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Unit>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var actvity = await _context.Activities.FindAsync(request.Id);

        if (actvity == null)
          throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity" });

        var user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == _userAccessor.GetCurrentUsername());
        // The user should always exist because of the authentification
        // So no need to check if it exists

        var attendance = await _context.UserActivities.SingleOrDefaultAsync(a => a.AppUserId == user.Id && a.Activity.Id == actvity.Id);

        if (attendance == null)
          return Unit.Value;

        if (attendance.IsHost)
          throw new RestException(HttpStatusCode.BadGateway, new { attendance = "You can not remove yourself as Host" });

        _context.UserActivities.Remove(attendance);


        var successed = await _context.SaveChangesAsync() > 0;

        if (successed)
        {
          return Unit.Value;
        }

        throw new Exception("Problem saving actvity");
      }
    }
  }
}