﻿using System.ComponentModel.DataAnnotations;

namespace Salary.API.DTOs.Request
{
    public class AuthenticationDTO
    {
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; } = String.Empty;
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = String.Empty;
    }
}
