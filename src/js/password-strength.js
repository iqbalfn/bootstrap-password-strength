/**
 * --------------------------------------------------------------------------
 * Bootstrap Password Strength (v0.0.1): password-strength.js
 * Licensed under MIT (https://github.com/iqbalfn/bootstrap-password-strength/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME               = 'pwdstr'
const VERSION            = '0.0.1'
const DATA_KEY           = 'bs.pwdstr'
const EVENT_KEY          = `.${DATA_KEY}`
const DATA_API_KEY       = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const Default = {
    progress    : null,
    tester      : function(cb, pass, input){
        let score = 0
        if(!pass)
            return cb(score)

        // award every unique letter until 5 repetitions
        let letters = new Object()
        for (let i=0; i<pass.length; i++){
            letters[pass[i]] = (letters[pass[i]] || 0) + 1
            score+= 5.0 / letters[pass[i]]
        }

        // bonus points for mixing it up
        let variations = {
            digits   : /\d/.test(pass),
            lower    : /[a-z]/.test(pass),
            upper    : /[A-Z]/.test(pass),
            nonWords : /\W/.test(pass)
        }

        let variationCount = 0;
        for (var check in variations)
            variationCount+= (variations[check] == true) ? 1 : 0

        score+= (variationCount - 1) * 10

        cb(parseInt(score))
    }
}

const DefaultType = {
    progress    : '(string|element)',
    tester      : '(string|function)'
}

const Event = {
    INPUT_DATA_API      : `input${EVENT_KEY}${DATA_API_KEY}`,
    CHANGE_DATA_API     : `change${EVENT_KEY}${DATA_API_KEY}`,
    UPDATE_DATA_API     : `update${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {}

const Selector = {}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class PasswordStrength {
    constructor(element, config) {
        this._config                = this._getConfig(config)
        this._element               = element
        this._progress              = this._config.progress
        this._progress_bar          = null
        this._tester                = this._config.tester
        this._value                 = 0

        if(typeof this._progress === 'string')
            this._progress = document.querySelector(this._progress)

        if(this._progress)
            this._progress_bar = $(this._progress).children('.progress-bar').get(0)

        if(typeof this._tester === 'string')
            this._tester = window[this._tester]

        this._addElementListener()
    }

    // Getters

    static get VERSION() {
        return VERSION
    }

    static get Default() {
        return Default
    }

    // Public

    dispose() {
        $(this._element).off(EVENT_KEY)
        $.removeData(this._element, DATA_KEY)

        this._config                = null
        this._element               = null
        this._progress              = null
        this._progress_bar          = null
        this._tester                = null
        this._value                 = 0
    }

    // Private

    _addElementListener(){
        $(this._element).on(Event.INPUT_DATA_API, e => {
            this._calculateStrength(e)
        })
        $(this._element).on(Event.CHANGE_DATA_API, e => {
            this._calculateStrength(e)
        })
    }

    _calculateStrength(event){
        this._tester(res => {
            this._updateProgress(res)
        }, this._element.value, this._element)
    }

    _updateProgress(value){
        if(!this._progress_bar || this._value == value)
            return

        this._value = value


        if(value > 100)
            value = 100

        let cls = 'progress-bar'
        if(value < 25)
            cls+= ' bg-danger'
        else if(value < 50)
            cls+= ' bg-warning'
        else if(value < 75)
            cls+= ' bg-info'
        else
            cls+= ' bg-success'

        this._progress_bar.setAttribute('aria-valuenow', value)
        this._progress_bar.setAttribute('class', cls)
        this._progress_bar.style.width = value + '%'

        $(this._element).trigger(Event.CHANGE_DATA_API, value)
    }

    _getConfig(config) {
        config = {
            ...Default,
            ...config
        }
        Util.typeCheckConfig(NAME, config, DefaultType)
        return config
    }

    // Static

    static _jQueryInterface(config, relatedTarget) {
        return this.each(function () {
            let data = $(this).data(DATA_KEY)
            const _config = {
                ...Default,
                ...$(this).data(),
                ...typeof config === 'object' && config ? config : {}
            }

            if (!data) {
                data = new PasswordStrength(this, _config)
                $(this).data(DATA_KEY, data)
            }
        })
    }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = PasswordStrength._jQueryInterface
$.fn[NAME].Constructor = PasswordStrength
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return PasswordStrength._jQueryInterface
}

export default PasswordStrength