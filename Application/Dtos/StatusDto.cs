﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class StatusDto
    {
        public Guid CompanyId { get; set; }
        public string StatusType { get; set; }
    }
}
