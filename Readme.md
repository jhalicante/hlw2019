## HALALAN WIDGET 2019


#####RSS Feed API URL :
```https://news.abs-cbn.com/rss/tag/halalan-2019```

_
----

#####Senator Results JSON : 
```https://blob-prod-senator.abs-cbn.com/widget/result-senator.json```

_
----

#####Blob Storage Credential for Halalan Widget:
    Storage account name: halalanwidget
    Keys: XLv1xLDQD0EVX6gRhb2N7d0JPQM6J5H60EFOvxYxPPSeLyCeSP99uPkDTAruX2arm9g6o3zFTxMBqBYAtqU2ZA==

_
----

#####Dev Widget Controller Dashboard
[Goto Dashboard) (https://devstorageswitch.z23.web.core.windows.net/halalan/home.html)

    username : newsteam
    password : W@u4eqg@q7=rzf2K


_
----

####Add widget to the site:

#####Head:
```<link rel="stylesheet" type="text/css" href="/src/styles/iframe-resizer.css">```

#####Iframe: (Rename the widget-results.html to widget.html)
```
<iframe id="halalan-widget-2019-iframe" class="halalan-widget"  src="//widget.html" width=“100%” scrolling=“no” frameborder="0"></iframe>```



#####Add this to uninav for the widget on/off to prevent whitespace
```src/scripts/widget-switch.js```

_
----
#####Setup:

 - `npm install | yan install`
 - `gulp`

_
----

#####Preview Local: 

    localhost:2019/
    localhost:2019/phase-1.html
    localhost:2019/phase-2.html
    localhost:2019/phase-3.html
    localhost:2019/phase-4.html
    localhost:2019/phase-5.html
    localhost:2019/widget-results.html

    
_
----

#####Per site Switches parameter:
```PROD API URL:```
```//oneottprodapi.azure-api.net/switch/v1/getswitch```
```PROD OCP KEY:```
```d79a936b9fec4ec2b0759e595887a3d5```

```DEV API URL:```
```//dev-api.abs-cbn.com/switch/v1/getswitch```
```DEV OCP KEY:```
```2643d7fa4c764507811241b67d43dd34```

    news:
        newshalwidget1
        newshalwidget2
        newshalwidget3
        newshalwidget4

    entertainment:
        entertainmenthalwidget1
        entertainmenthalwidget2
        entertainmenthalwidget3
        entertainmenthalwidget4

    lifestyle: 
        lifestlyehalwidget1
        lifestlyehalwidget2
        lifestlyehalwidget3
        lifestlyehalwidget4
        
    sports:
        sportshalwidget1
        sportshalwidget2
        sportshalwidget3
        sportshalwidget4
        

_
----

#####Dev Tools / Languages / Markup
- Nunjucks for Templating Engine
- HTML + CSS + SCSS + JS OOP + JQUERY
- Socket IO
- VS Code Text Editor
- Gulp Compiler

_
----
###Developer 
#####John Mark Alicante
#####Front End Developer