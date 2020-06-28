@extends('layouts.app')

@section('content')
<section class="loginSec passwordSec" >
  <div class="container h-100" style="margin-top:5%;">
  <form method="POST" action="{{ route('password.update') }}">
    @csrf

    <input type="hidden" name="token" value="{{ $token }}">
    <input id="email" type="hidden" name="email" value="{{ $email ?? old('email') }}" >
    <div class="row justify-content-center h-100">
      <div class="col-lg-5 col-md-6 col-12 h-100 align-items-center d-flex justify-content-center">
        <div class="Gologin">
          <div class="head p-4 text-center">
            <img src="/images/logo.png" class="img-fluid">
          </div>
          <div class="Goinput text-center">
            <h5>שלום {{$name}}
                <span class="d-block">אנא בחר סיסמא  </span></h5>
            <form>
              <div class="form-group">
              <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password"  placeholder=" סיסמא  ">

                @error('password')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            
              <input id="password-confirm" type="password" placeholder="וידואי סיסמא  " class="form-control" name="password_confirmation" required autocomplete="new-password">
            </div>
           </form>
           <button type="submit" class="btn mt-5 custom-btn">
           שמור סיסמא וכנס למערכת
            </button>
          </div>
        </div>
      </div>
    </div>
</form>
  </div>
</section>
@endsection
