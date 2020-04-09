import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: './user-registration.component.html',
    styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit{
    
    registrationForm: FormGroup;

    constructor(private formBuilder: FormBuilder){}
    
    ngOnInit(): void {

        this.registrationForm = this.formBuilder.group({
            userName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            address: ['', Validators.required],
            birthDate: ['', Validators.required],
            phoneNumber: ['', Validators.required]
        });
    }

    register(){
        console.log(this.registrationForm.value);
    }

    validateFormControl(formControl):boolean{
        return formControl.untouched || formControl.valid;
    }
}