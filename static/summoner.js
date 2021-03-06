
export default summoner
import summonerd from './sumdata.js'
import ranks from './rank.js'
const apikey = 'RGAPI-098d1c31-f601-45f7-96f5-20887a7b5255'

let summonerimg = document.createElement('img')
let summonerimg1 = document.createElement('img')
document.getElementById('searchbtn').addEventListener('click', () => {
    if ( document.getElementById('search').value == '') {
      window.alert('Please enter summoner name')
    }
    else {
      summoner(apikey, summonerimg, summonerimg1, summonerd)
    }
});
function summoner(apikey, summonerimg, summonerimg1, summonerd) {
   
    let content = document.getElementById('content')
    
    var ranked = {
        'RANKED_SOLO_5x5':'Ranked Solo'
    }
    const options = {
        method: 'GET'
    }
    const summoner = document.getElementById('search').value 
    
    document.getElementById('search').value = ''
    
    fetch(`https://cors-anywhere.herokuapp.com/https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${apikey}`, options)
    .then(res => (res.json()))
    .then(data => {
        console.log(data)
        if (data.status != null){
            window.alert('Invalid Summoner Name')
            return
        }
        
        // Initially insert summoner's name and summoner's profile picture 
        let summonername = document.getElementById('summonername')
        summonername.innerText = data.name
        document.getElementById('level').innerText = 'Level: ' + data.summonerLevel
        
        summonerimg = document.getElementById('sumimg')
        summonerimg.src = `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${data.profileIconId}.jpg?image=q_auto&v=1518361200`
        summonerimg.width = 150
        summonerimg.length = 150
        let summonerid = data.id
        
        fetch(`https://cors-anywhere.herokuapp.com/https://oc1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid}?api_key=${apikey}`)
        .then(res => (res.json()))
        .then(league => {
            // We fill out their ranked stats
            let queue = document.getElementById('queue')
            queue.innerText = ranked[league[0].queueType] 
            // Creating the logo for their rank
            let rankimage = document.getElementById('rankimg')
            rankimage.src = 'https://opgg-static.akamaized.net/images/medals/' + league[0].tier.toLowerCase() + '_1.png?image=q_auto&v=1'
            rankimage.height = 100
            rankimage.width = 100
            
            document.getElementById('rank').innerText =  league[0].tier + ' ' + league[0].rank
            document.getElementById('LPWL').innerText = league[0].leaguePoints + ' LP' + ' / ' + league[0].wins + 'W ' + league[0].losses + 'L'
            let floatie = parseFloat(league[0].wins)/parseFloat(league[0].wins + league[0].losses)*100
            let winrate = floatie.toFixed(1)
            document.getElementById('WR').innerText = "Win Ratio " + winrate + "%"
        })
        
        // We write information for each of the player's top three champions
        for (var record of summonerd) {
            if (record['player'].toLowerCase() == summoner.toLowerCase()) {
            
                document.getElementById('champ1').src = record['champ1']
                document.getElementById('cs1').innerText = record['cs1']
                document.getElementById('kda1').innerText = record['kda1']
                document.getElementById('wr1').innerText = record['wr1']
                document.getElementById('pl1').innerText = record['pl1']
    
                document.getElementById('champ2').src = record['champ2']
                document.getElementById('cs2').innerText = record['cs2']
                document.getElementById('kda2').innerText = record['kda2']
                document.getElementById('wr2').innerText = record['wr2']
                document.getElementById('pl2').innerText = record['pl2']
    
                document.getElementById('champ3').src = record['champ3']
                document.getElementById('cs3').innerText = record['cs3']
                document.getElementById('kda3').innerText = record['kda3']
                document.getElementById('wr3').innerText = record['wr3']
                document.getElementById('pl3').innerText = record['pl3']
    
                // We provide information for the summoner's last ten games
                document.getElementById('WL').innerText = '10G ' + record['win'] +'W ' + record['lose'] + 'L' 
                document.getElementById('KDA').innerText = record['kdar'] + ' KDA'
                document.getElementById('KP').innerText = record['kp'] + 'KP'
                document.getElementById('recentg').style.display = 'block'
                document.getElementById('sum1').style.display = 'flex'
            }
        }

    // Constructing a pie graph to represent the last ten games of the player
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    // Creating the chart
    function drawChart() {
        for (var record of summonerd) {
            if (record['player'].toLowerCase() == summoner.toLowerCase()) {
                // We fill out the contents of the pie graph
                var data = google.visualization.arrayToDataTable([
                ['Games', 'Results'],
                ['Wins', parseInt(record['win'])],
                ['Losses', parseInt(record['lose'])]
            ]);
        }
        // Some customisation for the pie graph
        var chartoptions = {width:100,
            height:100,
            legend: 'none',
            chartArea: {'width': '100%', 'height': '100%'},
            pieHole: 0.6,           
            pieSliceText: "none",
            tooltipWidth:100,
            tooltipHeight:100,
            tooltipFontSize:12
        };
        // We initiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, chartoptions);               
        }
    }
    
        // We now input the summoner's past ranks
        i = 0
        let t = document.getElementById("pastranks")
        for(var z = t.rows.length - 1; z > 0; z--) {
            t.deleteRow(z);
        }
        
        for (var player of ranks) {
            
            if (player['player'] == summoner) {
                for (var season of player['seasons']){
                    var row = t.insertRow(-1)
                    var cell1 = row.insertCell(-1)
                    cell1.innerText = season
                    var cell2 = row.insertCell(-1)
                    if (season == 'S3') {
                        cell2.innerText = player['league'][0]
                    }else {
                        cell2.innerText = player['ranks'][i]
                        i++ 
                    }
                }
                
            }
        }
    })
    
    // We do the exact same as the previous segment, except we do it for the second summoner (if they are searched up)
    if ( document.getElementById('search1').value != '') {
        const summoner1 = document.getElementById('search1').value 
        let content1 = document.getElementById('content1')
        fetch(`https://cors-anywhere.herokuapp.com/https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner1}?api_key=${apikey}`, options)
        .then(res => (res.json()))
        .then(data => {
            if (data.status != null){
                window.alert('Invalid Summoner Name')
                return
            }
            let summonername = document.getElementById('summonername1')
            summonername.innerText = data.name
            document.getElementById('level1').innerText = 'Level: ' + data.summonerLevel
            content1.insertBefore(summonerimg1, content1.children[1])
            summonerimg1 = document.getElementById('sumimg1')
            summonerimg1.src = `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${data.profileIconId}.jpg?image=q_auto&v=1518361200`
            summonerimg1.width = 150
            summonerimg1.length = 150
            let summonerid1 = data.id
            fetch(`https://cors-anywhere.herokuapp.com/https://oc1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid1}?api_key=${apikey}`)
            .then(res => (res.json()))
            .then(league => {
                //console.log(league)
                let queue = document.getElementById('queue1')               
                queue.innerText = ranked[league[0].queuetype]
                let rankimage = document.getElementById('rankimg1')
                rankimage.src = 'https://opgg-static.akamaized.net/images/medals/' + league[0].tier.toLowerCase() + '_1.png?image=q_auto&v=1'
                rankimage.height = 100
                rankimage.width = 100
                queue.innerText = ranked[league[0].queueType] 
                document.getElementById('rank1').innerText =  league[0].tier + ' ' + league[0].rank
                document.getElementById('LPWL1').innerText = league[0].leaguePoints + ' LP' + ' / ' + league[0].wins + 'W ' + league[0].losses + 'L'
                let floatie = parseFloat(league[0].wins)/parseFloat(league[0].wins + league[0].losses)*100
                let winrate = floatie.toFixed(1)
                document.getElementById('WR1').innerText = "Win Ratio " + winrate + "%"
            })
        })
        document.getElementById('search1').value = ''
        for (var record of summonerd) {
            if (record['player'].toLowerCase() == summoner1.toLowerCase()) {
                document.getElementById('champ11').src = record['champ1']
                document.getElementById('cs11').innerText = record['cs1']
                document.getElementById('kda11').innerText = record['kda1']
                document.getElementById('wr11').innerText = record['wr1']
                document.getElementById('pl11').innerText = record['pl1']
    
                document.getElementById('champ21').src = record['champ2']
                document.getElementById('cs21').innerText = record['cs2']
                document.getElementById('kda21').innerText = record['kda2']
                document.getElementById('wr21').innerText = record['wr2']
                document.getElementById('pl21').innerText = record['pl2']
    
                document.getElementById('champ31').src = record['champ3']
                document.getElementById('cs31').innerText = record['cs3']
                document.getElementById('kda31').innerText = record['kda3']
                document.getElementById('wr31').innerText = record['wr3']
                document.getElementById('pl31').innerText = record['pl3']
    
                document.getElementById('WL1').innerText = '10G ' + record['win'] +'W ' + record['lose'] + 'L' 
                document.getElementById('KDA1').innerText = record['kdar'] + ' KDA'
                document.getElementById('KP1').innerText = record['kp'] + 'KP'
                document.getElementById('recentg1').style.display = 'block'
                document.getElementById('sum2').style.display = 'flex'
            }
        }
        
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart1);
        function drawChart1() {
            for (var record of summonerd) {
                if (record['player'].toLowerCase() == summoner1.toLowerCase()) {
                    var data = google.visualization.arrayToDataTable([
                    ['Games', 'Results'],
                    ['Wins', parseInt(record['win'])],
                    ['Losses', parseInt(record['lose'])]
                ]);
            }
            var chartoptions = {width:100,
                height:100,
                legend: 'none',
                chartArea: {'width': '100%', 'height': '100%'},
                pieHole: 0.6,           
                pieSliceText: "none",
                tooltipWidth:100,
                tooltipHeight:100,
                tooltipFontSize:12
            };
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
            chart.draw(data, chartoptions);               
            }
        }
        
        var i = 0
        let x = document.getElementById("pastranks1")
        for(var z = x.rows.length - 1; z > 0; z--) {
            x.deleteRow(z);
        }
        
        for (var player of ranks) {            
            if (player['player'] == summoner1) {
                for (var season of player['seasons']){
                    var row = x.insertRow(-1)
                    var cell1 = row.insertCell(-1)
                    cell1.innerText = season
                    var cell2 = row.insertCell(-1)
                    if (season == 'S3') {
                        cell2.innerText = player['league'][0]
                    }else {
                        cell2.innerText = player['ranks'][i]
                        i++ 
                    }
                }
                break; 
            }
        }       
    }  
}
