# The Fast Link
- https://github.com/vercel/next.js/tree/master/examples/with-firebase-authentication
- https://github.com/colinhacks/next-firebase-ssr
- https://github.com/gladly-team/next-firebase-auth

https://www.youtube.com/watch?v=1BUT7T9ThlU

https://www.pluralsight.com/guides/generating-dynamic-forms-from-json-in-react
https://formik.org/docs/examples/field-arrays

## TODO
- change img tags into nextjs images

TODO: sort array by position always

- register user
- (change pass, email)
- landing page
- fix https://stackoverflow.com/questions/45110441/firebase-auth-invalid-custom-token renew token after invalid in cookies


## embed
```html
<iframe
  width="100%"
  height="400"
  src="https://www.thefast.link/podcastName"
  frameborder="0"allowfullscreen>
</iframe>
```

## popup embed
https://www.youtube.com/watch?v=FoXzDp-qzvw
```html
<div class="full-screen-popup hidden flex-container-center"
  <iframe width="100%" height="400" src="https://www.thefast.link/podcastName" frameborder="0" allowfullscreen>
  </iframe>
</div>
```

```css
.full-screen-popup {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
}

.flex-container-center {
  displaY: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
}

.hidden {
    display: none;
}
```
```javascript
const popup = document.querySelector('.full-screen-popup');

function showPopup(){
  popup.classList.remove('hidden');
}

function closePopup(){
  popup.classList.add('hidden');
}
```

