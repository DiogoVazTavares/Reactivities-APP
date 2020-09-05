using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security
{
  public class JwtGenerator : IJwtGenerator
  {
    private readonly SymmetricSecurityKey _key;
    public JwtGenerator(IConfiguration config)
    {
      _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }

    public string CreateToken(AppUser user)
    {
      /*
          JWT (JSON Web Token) is strutured in three main parts, separated by a "."
          The parts are:
              - Header ()
              - Payload
              - Signature

        For a detailed explenation of each part visit https://jwt.io/introduction/
      */

      // Creating the claims at are part of the Payload section of the jwt
      var claims = new List<Claim> {
            new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
        };

      // generating the signing credentials. they belings to the Signature section of the jwt
      var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

      var tokenDescriptior = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(7),
        SigningCredentials = creds
      };

      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptior);

      return tokenHandler.WriteToken(token);
    }
  }
}