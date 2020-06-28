@extends('layouts.app')

@section('content')
<section class="loginSec">
  <div class="container h-100">
    <div class="row justify-content-center h-100">
      <div class="col-lg-5 col-md-6 col-12 h-100 align-items-center d-flex justify-content-center">
        <div class="Gologin">
          <div class="head p-4 text-center">
            <img src="{{ asset('images/logo.png') }} " class="img-fluid">
          </div>
          <div class="Goinput text-center">
          <form method="POST" action="{{ route('login') }}">
          @csrf
              <div class="form-group">
              <input id="email" type="text" class="form-control mb-3 @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus placeholder="מספר טלפון או כתובת מייל  ">

                @error('email')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" placeholder="סיסמא  ">

                @error('password')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            

           <button type="submit" class="btn mt-5 custom-btn">
                כניסה  
            </button>

            @if (Route::has('password.request'))
                <div style="margin-top:20px;">
                    <a href="{{ route('password.request') }}">
                    שכחת סיסמא? 
                    </a>
                </div>
            @endif
           </div>
           </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

@endsection
