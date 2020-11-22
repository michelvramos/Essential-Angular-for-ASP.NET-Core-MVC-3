using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerApp.Models
{
    public class Payment
    {
        [BindNever] public long PaymentId { get;set; }
        [Required] public string CardNumber { get; set; }
        [Required] public string CardExpiry { get; set; }
        [Required] public string CardSecurityCode { get; set; }
        
        [BindNever]
        [Column(TypeName ="decimal(18,2)")]
        public decimal Total { get; set; }
        [BindNever] public string AuthCode { get; set; }

    }
}