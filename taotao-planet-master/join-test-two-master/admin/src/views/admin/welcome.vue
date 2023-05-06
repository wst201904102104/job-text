<template>
    <div class="welcome">
        <div class="space-12"></div>
        <div class="row">
          <div class="center">
                <span class="btn btn-app btn-sm btn-light no-hover">
                  <span class="line-height-1 bigger-170 blue"> 1,411 </span>

                  <br />
                  <span class="line-height-1 smaller-90"> 课程 </span>
                </span>

                <span class="btn btn-app btn-sm btn-yellow no-hover">
                  <span class="line-height-1 bigger-170"> 32 </span>

                  <br />
                  <span class="line-height-1 smaller-90"> 大章 </span>
                </span>

                <span class="btn btn-app btn-sm btn-pink no-hover">
                  <span class="line-height-1 bigger-170"> 4 </span>

                  <br />
                  <span class="line-height-1 smaller-90"> 小节 </span>
                </span>

                <span class="btn btn-app btn-sm btn-grey no-hover">
                  <span class="line-height-1 bigger-170"> 23 </span>

                  <br />
                  <span class="line-height-1 smaller-90"> 会员 </span>
                </span>

                <span class="btn btn-app btn-sm btn-success no-hover">
                  <span class="line-height-1 bigger-170"> 7 </span>

                  <br />
                  <span class="line-height-1 smaller-90"> 报名 </span>
                </span>

                <span class="btn btn-app btn-sm btn-primary no-hover">
                  <span class="line-height-1 bigger-170"> 55 </span>

                  <br />
                  <span class="line-height-1 smaller-90"> 评论 </span>
                </span>
          </div>
          <div class="space-12"></div>
          <div class="hr hr2 hr-double"></div>
          <div class="space-12"></div>
        </div>
        <div class="col-sm-12 infobox-container">
          <div class="infobox infobox-green">
            <div class="infobox-icon">
              <i class="ace-icon fa fa-comments"></i>
            </div>

            <div class="infobox-data">
              <span class="infobox-data-number">111</span>
              <div class="infobox-content">新增评论</div>
            </div>

            <div class="stat stat-success">8%</div>
          </div>

          <div class="infobox infobox-blue">
            <div class="infobox-icon">
              <i class="ace-icon fa fa-twitter"></i>
            </div>

            <div class="infobox-data">
              <span class="infobox-data-number">11</span>
              <div class="infobox-content">新注册会员</div>
            </div>

            <div class="badge badge-success">
              +32%
              <i class="ace-icon fa fa-arrow-up"></i>
            </div>
          </div>

          <div class="infobox infobox-pink">
            <div class="infobox-icon">
              <i class="ace-icon fa fa-shopping-cart"></i>
            </div>

            <div class="infobox-data">
              <span class="infobox-data-number">8</span>
              <div class="infobox-content">课程报名</div>
            </div>
            <div class="stat stat-important">4%</div>
          </div>
          
        </div>
        <div class="space-12"></div>
        <div class="hr hr2 hr-double"></div>
        <div class="space-12"></div>
        <div class="col-sm-12">
          <div class="widget-box transparent">
            <div class="widget-header widget-header-flat">
              <h4 class="widget-title lighter">
                <i class="ace-icon fa fa-signal"></i>
                曲线走势
              </h4>

              <div class="widget-toolbar">
                <a href="#" data-action="collapse">
                  <i class="ace-icon fa fa-chevron-up"></i>
                </a>
              </div>
            </div>

            <div class="widget-body">
              <div class="widget-main padding-4">
                <div id="sales-charts" style="width: 100%; height: 220px; padding: 0px; position: relative;"><canvas class="flot-base" width="1106" height="440" style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 553px; height: 220px;"></canvas><div class="flot-text" style="position: absolute; inset: 0px; font-size: smaller; color: rgb(84, 84, 84);"><div class="flot-x-axis flot-x1-axis xAxis x1Axis" style="position: absolute; inset: 0px; display: block;"><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 37px; text-align: center;">0.0</div><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 117px; text-align: center;">1.0</div><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 197px; text-align: center;">2.0</div><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 278px; text-align: center;">3.0</div><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 358px; text-align: center;">4.0</div><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 439px; text-align: center;">5.0</div><div class="flot-tick-label tickLabel" style="position: absolute; max-width: 57px; top: 201px; left: 519px; text-align: center;">6.0</div></div><div class="flot-y-axis flot-y1-axis yAxis y1Axis" style="position: absolute; inset: 0px; display: block;"><div class="flot-tick-label tickLabel" style="position: absolute; top: 187px; left: 1px; text-align: right;">-2.000</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 164px; left: 3px; text-align: right;">-1.500</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 140px; left: 3px; text-align: right;">-1.000</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 117px; left: 1px; text-align: right;">-0.500</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 94px; left: 8px; text-align: right;">0.000</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 70px; left: 8px; text-align: right;">0.500</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 47px; left: 10px; text-align: right;">1.000</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 23px; left: 10px; text-align: right;">1.500</div><div class="flot-tick-label tickLabel" style="position: absolute; top: 0px; left: 8px; text-align: right;">2.000</div></div></div><canvas class="flot-overlay" width="1106" height="440" style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 553px; height: 220px;"></canvas><div class="legend"><div style="position: absolute; width: 70px; height: 66px; top: 14px; right: 14px; background-color: rgb(255, 255, 255); opacity: 0.85;"> </div><table style="position:absolute;top:14px;right:14px;;font-size:smaller;color:#545454"><tbody><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(237,194,64);overflow:hidden"></div></div></td><td class="legendLabel">Domains</td></tr><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(175,216,248);overflow:hidden"></div></div></td><td class="legendLabel">Hosting</td></tr><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(203,75,75);overflow:hidden"></div></div></td><td class="legendLabel">Services</td></tr></tbody></table></div></div>
              </div><!-- /.widget-main -->
            </div><!-- /.widget-body -->
          </div><!-- /.widget-box -->
        </div>
        
    </div>
</template>
<script>


export default {
	name: 'Welcom',
	mounted: function (){
    let _this = this;
    _this.drawSelectChart();
	},
  methods:{

    drawSelectChart(){
      let d1 = [];
      for(let i = 0; i< 30; i+=1){
        d1.push([i + 1,2000 + Math.floor(Math.random() * 100)+1]);
      }
      let d2 = [];
      for(let i = 0; i< 30; i+=1){
        d2.push([i + 1,1900 + Math.floor(Math.random() * 100)+1]);
      }
      
      let sales_charts = $('#sales-charts').css({'width':'100%' , 'height':'220px'});
				$.plot("#sales-charts", [
					{ label: "最近30天", data: d1 },
					{ label: "上一周期", data: d2 },
				], {
					hoverable: true,
					shadowSize: 0,
					series: {
						lines: { show: true },
						points: { show: true }
					},
					xaxis: {
						tickLength: 0
					},
					yaxis: {
						ticks: 10,
						min: -2,
						max: 2,
						tickDecimals: 3
					},
					grid: {
						backgroundColor: { colors: [ "#fff", "#fff" ] },
						borderWidth: 1,
						borderColor:'#555'
					}
				});
    },//end method 
    
  },//end methods
	
}
</script>