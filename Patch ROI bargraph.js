<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="/common/js/vendor/jquery-1.11.0.min.js"><\/script>')</script>

<script type="text/javascript">
    $(document).ready(function() {
      
      /* Set initial values of bar graphs based on user's input */
      var val1 = $('.windowsPCs div.ixp-component-slider-value').text();
      var val2 = $('.professionalCost div.ixp-component-slider-value').text();
      var val3 = $('.patchHours div.ixp-component-slider-value').text();
      var val4 = $('.nonMicrosoftPatches div.ixp-component-slider-value').text();
      updateResults(val1, val2, val3, val4);

      // Format slider values to show commas
      $("div.ixp-component-slider-value").each(function( index ) {
        var sliderValue = $(this).text();
        var formattedSliderValue = numberWithCommas(sliderValue);
        $(this).text(formattedSliderValue);
      });
      
      // Add class 'sliderValue' to each hidden input for reference later
      $('input:hidden').each(function() {
        $(this).prop('type', 'text').addClass('sliderValue');
      });

      // Function to render bar graphs based on slider values
        var calcStep = 1;
        var step1Val;
        var step2Val;
        var step3Val;
        var step4Val;
        var manualOwnershipCost;
        var shavlik1Yr;
        var shavlik2Yr;
        var shavlik3Yr;
        var shavlikTime;
        var patchingTime;

        function updateResults(value1, value2, value3, value4){
      		var step1Val = value1.replace(',', '');
      		var step2Val = value2;
            step2Val = step2Val.replace('$', '');
            step2Val = step2Val.replace(',', '');
      		var step3Val = value3.replace(',', '');;
      		var step4Val = value4.replace(',', '');;

            var employeeCostPerHour = step2Val / 2080;
            var employeeCostPerMachine = step2Val / (160 * 12) * 0.024 * step1Val;

            var licenseCost1Yr = step1Val * 5;
            var licenseCost2Yr = step1Val * 4;
            var licenseCost3Yr = step1Val * 3;

            manualOwnershipCost = Math.round(employeeCostPerHour * step3Val * step4Val);
            shavlik1Yr = Math.round(employeeCostPerMachine + licenseCost1Yr);
            shavlik2Yr = Math.round(employeeCostPerMachine + licenseCost2Yr);
            shavlik3Yr = Math.round(employeeCostPerMachine + licenseCost3Yr);

            // Update cost of ownership graphs
            //*********************************************************
            var maxVal = Math.max(manualOwnershipCost, shavlik1Yr, shavlik2Yr, shavlik3Yr);

            var barH = $("#graph-ownership .bar1").height();
            var fillTop;

            var bar1Percent = 100 - manualOwnershipCost / maxVal * 100;
            if (bar1Percent > 75) bar1Percent = 75;
            fillTop = barH * (bar1Percent / 100);
            $("#graph-ownership img").eq(0).css("margin-top", fillTop);
            $("#graph-ownership .label").eq(0).text(formatNumber(manualOwnershipCost, true)).css("top", fillTop + 2);

            var bar2Percent = 100 - shavlik1Yr / maxVal * 100;
            if (bar2Percent > 75) bar2Percent = 75;
            fillTop = barH * (bar2Percent / 100);
            $("#graph-ownership img").eq(1).css("margin-top", fillTop);
            $("#graph-ownership .label").eq(1).text(formatNumber(shavlik1Yr, true)).css("top", fillTop + 2);

            var bar3Percent = 100 - shavlik2Yr / maxVal * 100;
            if (bar3Percent > 75) bar3Percent = 75;
            fillTop = barH * (bar3Percent / 100);
            $("#graph-ownership img").eq(2).css("margin-top", fillTop);
            $("#graph-ownership .label").eq(2).text(formatNumber(shavlik2Yr, true)).css("top", fillTop + 2);

            var bar4Percent = 100 - shavlik3Yr / maxVal * 100;
            if (bar4Percent > 75) bar4Percent = 75;
            fillTop = barH * (bar4Percent / 100);
            $("#graph-ownership img").eq(3).css("margin-top", fillTop);
            $("#graph-ownership .label").eq(3).text(formatNumber(shavlik3Yr, true)).css("top", fillTop + 2);

            // Update hours of patching graphs
            //*********************************************************
            shavlikTime = Math.round(step1Val * .024);
            patchingTime = Math.round(step3Val * step4Val);
            maxVal = Math.max(shavlikTime, patchingTime);

            barH = $("#graph-patching .bar1").height();

            var bar1Percent = 100 - patchingTime / maxVal * 100;
            if (bar1Percent > 75) bar1Percent = 75;
            fillTop = barH * (bar1Percent / 100);
            $("#graph-patching img").eq(0).css("margin-top", fillTop);
            $("#graph-patching .label").eq(0).text(formatNumber(patchingTime)).css("top", fillTop + 2);

            var bar2Percent = 100 - shavlikTime / maxVal * 100;
            if (bar2Percent > 75) bar2Percent = 75;
            fillTop = barH * (bar2Percent / 100);
            $("#graph-patching img").eq(1).css("margin-top", fillTop);
            $("#graph-patching .label").eq(1).text(formatNumber(shavlikTime)).css("top", fillTop + 2);
        }
      
      function formatNumber(val, currency){
          val = Math.round(val);
          var re = '(\\d)(?=(\\d{3})+$)';
          return (currency?'$':'') + val.toFixed(0).replace(new RegExp(re, 'g'), '$1,');
      }
      
      // Update bar graphs dynamically on user interaction
      $("body").on('DOMSubtreeModified', "div.ixp-component-slider-value", function() { 
      	var val1 = $('.windowsPCs div.ixp-component-slider-value').text();
      	var val2 = $('.professionalCost div.ixp-component-slider-value').text();
      	var val3 = $('.patchHours div.ixp-component-slider-value').text();
      	var val4 = $('.nonMicrosoftPatches div.ixp-component-slider-value').text();
        updateResults(val1, val2, val3, val4);
      });
      
      // Function to format numbers with commas
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      
  	  // onchange event for slider
	  window.ixp.runtime.events.on(this, 'ixp-slider:saved', function(e) {
	  	var elem_id = '#ball_'+e.instanceId;
		var formatted = numberWithCommas($(elem_id + ' div.ixp-component-slider-value').text());
		$(elem_id + ' div.ixp-component-slider-value').text(formatted)
	  });  
  });
</script>