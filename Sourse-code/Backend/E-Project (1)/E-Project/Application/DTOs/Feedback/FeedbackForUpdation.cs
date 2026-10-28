using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Feedback
{
    public class FeedbackForUpdation
    {
        public int Id { get; set; }
        public string Comment { get; set; }

        public int Rating { get; set; }

    }
}
