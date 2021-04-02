# Oops.js

Library to prevent loss of form data in the following situations:
Refresh the page;
Close the tab  of the browser;
Close the browser;

# Starting

Get a copy of the **oops** project for your machine.

# Installing

Copy the **oops.min.js** located in the directory **src/** for your development area.

Use the tag `<script>` with the **src** attribute pointing to **oops.min.js**

```js
<script src script="oops.min.js"></script>
```

# Example 1

```js
<form action="" class="form-sty">
    <input type="text" placeholder="Your username" data-oops>
    <input type="url" placeholder="base url" data-oops>
    <input type="email" placeholder="Your email">
    <button type="submit"id="_submit">Submit</button>
    <button type="reset" id="_reset">Reset</button>
</form>
    
<script src script="oops.min.js"></script>

<script>
    
    var ps = new Oops();
    
    ps.start();

</script>
```

We define the fields that we want your data to be tracked and saved by **oops.js** adding the `data-oops` attribute to them.

We created an instance `var ps = new Oops(); `and initialize the tracker with `ps.start();`.

😃 and ready!

Now the fields that have the `data-oops` attribute have not lost their data if : The page is updated, the browser tab is closed, or the browser is closed.
# Example 2

```js
<form action="" class="form-sty">
        <input type="text" placeholder="Your username" data-oops>
        <input type="url" placeholder="base url" data-oops>
        <input type="email" placeholder="Your email">
        <button type="submit"id="_submit">Submit</button>
        <button type="reset" id="_reset">Reset</button>
    </form>
    
    <s src script="oops.min.js"></script>
    
    <script>
        
        var ps = new Oops();
        
        ps.start();
        
        var btn_s = document.getElementById("_submit");
        var btn_r = document.getElementById("_reset");

        btn_s.addEventListener("click",function(){
            ps.clear();
        });

        btn_r.addEventListener("click",function(){
            ps.clear();
        });

    </script>
```

In this example we add more code, to delete the saved data when the form is submitted or when we decide to clear the filled fields, using the `.clear()` method ; despoable in the object of the `new Oops()` instance;

# Going deeper

The Constructor `Oops();` can receive by parameter a configuration object with `key` and `storage` properties.

```js
var config = {
    key : "my_key",
    storage : "sessionStorage",
};
var ps = new Oops (config);
```

**Key** property

The value of the key to be used by. Web Storage API.


> By default the key used is **oops_key**

**storage** property 

The Web Storage engine to use, which can be **localStorage** or **sessionStorage**.

**sessionstorage**

* Stores data for one session only, which means that the data is stored until the browser or tab is closed.

**localstorage**

* Stores data without an expiration date and is released only through JavaScript, or by clearing the Browser/Locally stored Data cache.


> By default the mechanism used is **localStorage**

# Available methods

`.start();` Initializes the tracker.

`.clear();` Clears the stored data.

# Authors

* [Pedro Manuel](https://www.linkedin.com/in/pedro-jmanuel) 

# Built with

* Vanilla Js

# License

* MIT

# Contributing

Commits must be verb-based, using the following pattern:
* Rectifying ...
* Adding ...
* Changing ...
* Removing ...
