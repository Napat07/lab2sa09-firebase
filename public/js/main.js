document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      document.querySelector('#status').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;

      let db = firebase.database();
    
      // load contacts both old and newly added
      db.ref('contacts').on('child_added', snapshot => {
        if (snapshot.exists()) {
          console.log("loaded", snapshot.key, snapshot.val());
  
          let contactRecord = contactRecordFromSnapshot(snapshot);
  
          document.querySelector('#contacts').innerHTML = contactRecord + document.querySelector('#contacts').innerHTML;
        }
      });

      db.ref('contacts').on('child_removed', snapshot => {
          document.querySelector('#' + snapshot.key).remove();
      });
  
      // save a new contact when "Add" button clicked
      document.querySelector('.addContact')
        .addEventListener('click', event => {
          event.preventDefault(); // prevents default form submit
          if (document.querySelector('#name').value != '' && 
              (document.querySelector('#email').value != '' ||
               document.querySelector('#phone').value != '')
             ) {
            db.ref('contacts').push({
              name: document.querySelector('#name').value,
              detail: {
                email: document.querySelector('#email').value,
                phone: document.querySelector('#phone').value
              }
            });
            contactForm.reset();
          } else {
            document.querySelector('#status').innerHTML = 'Some fields are missing';
          }
        });
    } catch (e) {
      console.error(e);
      document.querySelector('#status').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
});

function contactRecordFromSnapshot(snapshot) {
    let key = snapshot.key;
    let contact = snapshot.val();
    var record = '';

    record += '<div id="' + key + '" class="col s12 m6"><div class="card blue-grey darken-1"><div class="card-content white-text">'
    record += '<span class="card-title">' + contact.name + '</span>';
    record += '<p><i class="material-icons">email</i>Email: ' + contact.detail.email + '</p>';
    record += '<p><i class="material-icons">phone</i>Phone: ' + contact.detail.phone + '</p>';
    record += '</div><div class="card-action"><a href="#" onclick="removeContact(\'' + key + '\')">Remove</a></div>';
    record += '</div></div>';
  
    return record;
}

function removeContact(key) {
    firebase.database().ref('contacts/' + key).remove();
    console.log('removed', key);

    return false;
}
