function yesnoCheck(that) 
{
    if (that.value == "asknow") 
    {  document.getElementById("sysid").style.display = "block";
    }
  else
    {  document.getElementById("sysid").style.display = "none";
    }
    if (that.value == "api")
    {   document.getElementById("frequency").style.display = "block";
    }
  else
    {  document.getElementById("frequency").style.display = "none";
    }
    if (that.value == "yes")
    {   document.getElementById("dependency").style.display = "block";
    }
  else
    {  document.getElementById("dependency").style.display = "none";
    }
}