    
    {
        m3 = m2 - m1;
    }else{
        y3--;
        m3 = 12 + m2 - m1;
    }

    if(d2 >= d1)
    {
        d3 = d2 - d1;
    }else{
       m3--;
       d3 = getDaysInMonth(y1, m1) + d2 - d1;
    }  

    if(m3 < 0)
    {
        m3 = 11;
        y3--;
    }
    console.log(y3,m3,d3);
    result.innerHTML = `You are <span> ${y3} </span> years, <span> ${m3} </span> months, and <span> ${d3} </span> days old.`
    
}

function getDaysInMonth(year, month)
{
    return new Date(year, month, 0).getDate();
}