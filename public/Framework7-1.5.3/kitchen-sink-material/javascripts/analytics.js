$(document).ready(function(){
        
Morris.Bar({
  element: 'bot-acc-graph',
  data: [
    { y: 'Stroke', a: 76},
    { y: 'Accident', a: 86 },
    { y: 'Burns', a: 79 },
    { y: 'Labour', a: 68}
 
  ],
  xkey: 'y',
  ykeys: ['a'],
  labels: ['Diagnosis'],
  barColors : ['#73ba71']
});
    
Morris.Donut({
    element: 'canvas-Doughnut-panaji',
    data: [
    { label: 'Stroke', value: 76},
    { label: 'Accident', value: 86 },
    { label: 'Burns', value: 79 },
    { label: 'Labour', value: 68}
 
  ],
colors: [
'#0BA462',
'#73ba71']}
);

Morris.Donut({
    element: 'canvas-Doughnut-margao',
    data: [
    { label: 'Stroke', value: 46},
    { label: 'Accident', value: 36 },
    { label: 'Burns', value: 67 },
    { label: 'Labour', value: 75}
 
  ],
colors: [
'#0BA462',
'#73ba71']}
);
    
Morris.Line({
  element: 'line-utilization',
  data: [
    { y: '2009', a: 90, b: 90, c:40 },
    { y: '2010', a: 75,  b: 65, c:45 },
    { y: '2011', a: 50,  b: 40, c:46 },
    { y: '2012', a: 75,  b: 65, c:60 },
    { y: '2013', a: 50,  b: 40, c:80 },
    { y: '2014', a: 75,  b: 65, c:90 },
    { y: '2015', a: 100, b: 90, c:80 }
  ],
  xkey: 'y',
  ykeys: ['a', 'b', 'c'],
  labels: ['Series A', 'Series B', 'Series C']
});

})