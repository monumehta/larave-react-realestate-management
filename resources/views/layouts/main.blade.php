<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'GoClear') }}</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css')}}">
    <style type="text/css">
      body{height:100%;margin:0;padding:0;width:100%}body{font-family:Roboto,sans-serif;font-size:13px;-webkit-font-smoothing:antialiased}.ipl-progress-indicator.available{opacity:0}.ipl-progress-indicator{background-color:#f5f5f5;width:100%;height:100%;position:fixed;opacity:1;pointer-events:none;-webkit-transition:opacity cubic-bezier(.4,0,.2,1) 436ms;-moz-transition:opacity cubic-bezier(.4,0,.2,1) 436ms;transition:opacity cubic-bezier(.4,0,.2,1) 436ms;z-index:9999}.insp-logo-frame{display:-webkit-flex;display:-moz-flex;display:flex;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-webkit-justify-content:center;-moz-justify-content:center;justify-content:center;-webkit-animation:fadein 436ms;-moz-animation:fadein 436ms;animation:fadein 436ms;height:98%}.insp-logo-frame-img{width:112px;height:112px;-webkit-align-self:center;-moz-align-self:center;align-self:center;border-radius:50%}.ipl-progress-indicator-head{background-color:#c6dafc;height:4px;overflow:hidden;position:relative}.ipl-progress-indicator .first-indicator,.ipl-progress-indicator .second-indicator{background-color:#056d8b;bottom:0;left:0;right:0;top:0;position:absolute;-webkit-transform-origin:left center;-moz-transform-origin:left center;transform-origin:left center;-webkit-transform:scaleX(0);-moz-transform:scaleX(0);transform:scaleX(0)}.ipl-progress-indicator .first-indicator{-webkit-animation:first-indicator 2s linear infinite;-moz-animation:first-indicator 2s linear infinite;animation:first-indicator 2s linear infinite}.ipl-progress-indicator .second-indicator{-webkit-animation:second-indicator 2s linear infinite;-moz-animation:second-indicator 2s linear infinite;animation:second-indicator 2s linear infinite}.ipl-progress-indicator .insp-logo{animation:App-logo-spin infinite 20s linear;border-radius:50%;-webkit-align-self:center;-moz-align-self:center;align-self:center}@keyframes App-logo-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes fadein{from{opacity:0}to{opacity:1}}@-moz-keyframes fadein{from{opacity:0}to{opacity:1}}@keyframes fadein{from{opacity:0}to{opacity:1}}@keyframes first-indicator{0%{transform:translate(0) scaleX(0)}25%{transform:translate(0) scaleX(.5)}50%{transform:translate(25%) scaleX(.75)}75%{transform:translate(100%) scaleX(0)}100%{transform:translate(100%) scaleX(0)}}@keyframes second-indicator{0%{transform:translate(0) scaleX(0)}60%{transform:translate(0) scaleX(0)}80%{transform:translate(0) scaleX(.6)}100%{transform:translate(100%) scaleX(.1)}}
      .insp-logo-frame img {
        display: block;
        width: 100px;
        text-align: center;
        margin: 0 auto;
        height: 100px;
        border-radius: 50%;
      }
    </style>
</head>
<body>

<div class="ipl-progress-indicator" id="ipl-progress-indicator">
      <div class="ipl-progress-indicator-head">
        <div class="first-indicator"></div>
        <div class="second-indicator"></div>
      </div>
      <div class="insp-logo-frame">
       <img src="{{ asset('images/throbber.gif') }}"/>
      </div>
    </div>

    <div id="app"> </div>
    @yield('content')
    <script src="{{ asset('js/app.js')}}"> </script>
      
    
</body>
</html>
