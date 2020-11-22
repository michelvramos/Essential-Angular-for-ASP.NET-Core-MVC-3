using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models
{
    public class CartLine
    {
        [BindNever] public long CartLineId { get; set; }
        [Required] public long ProductId { get; set; }
        [Required] public int Quantity { get; set; }
    }
}