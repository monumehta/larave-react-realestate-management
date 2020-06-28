@extends('layouts.app')

@section('content')

<section class="loginSec">
  <div class="container h-100">
    <div class="row justify-content-center h-100">
      <div class="col-lg-4 col-md-6 col-12 h-100 align-items-center d-flex justify-content-center">
        <div class="Gologin">
          <div class="head p-4 text-center">
            <img src="{{asset('images/logo.png')}}" class="img-fluid">
          </div>
          @if (session('status'))
                <div class="alert alert-success" role="alert">
                    {{ session('status') }}
                </div>
            @endif
          <div class="Goinput Gopswrd text-center">
            
            <p class="mb-2"> שחזור סיסמא        </p>
            <p>  אנא הקלידו את המייל שלכם
                  ולינק לאיפוס סיסמא בדרך אליכם 
                </p>
            <form method="POST" action="{{ route('password.email') }}">
                @csrf
                <div class="form-group">
                    <input id="email" type="email" class="form-control mb-3 @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus placeholder="מייל  ">
                    @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
           
                <button type="submit" class="btn custom-btn">
                שליחה    
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

@endsection
