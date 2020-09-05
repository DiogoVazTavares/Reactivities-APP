using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
  public class Login
  {
    public class Query : IRequest<User>
    {
      public string Email { get; set; }
      public string Password { get; set; }
    }

    // Adding validation just so we don't go to the DataBase without a reason
    public class QueryValidator : AbstractValidator<Query>
    {
      public QueryValidator()
      {
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Query, User>
    {
      private readonly UserManager<AppUser> _useManager;
      private readonly SignInManager<AppUser> _signInManager;
      private readonly IJwtGenerator _jwtGenerator;

      public Handler(UserManager<AppUser> useManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
      {
        _jwtGenerator = jwtGenerator;
        _signInManager = signInManager;
        _useManager = useManager;
      }

      public async Task<User> Handle(Query request, CancellationToken cancellationToken)
      {
        // Check if user exists
        var user = await _useManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
          throw new RestException(HttpStatusCode.Unauthorized);
        }

        // Check password and try to signin the user;
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (result.Succeeded)
        {
          // if there is a users signIn the user and return the object (for now)
          return new User
          {
            DisplayName = user.DisplayName,
            Token = _jwtGenerator.CreateToken(user),
            Username = user.UserName,
            Image = null
          };
        }

        throw new RestException(HttpStatusCode.Unauthorized);
      }
    }
  }
}