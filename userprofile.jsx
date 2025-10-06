import React from 'react'

function userprofile() {
    firestore.collection('users').doc('user1').get().then(function(doc) {
    if (doc.exists) {
      var data = doc.data();
      console.log(data);
    } else {
      console.log("No such document!");
    }
  })
  .catch(function(error) {
    console.error("Error fetching data: ", error);
  });
  return (
    <div>
      
    </div>
  )
}

export default userprofile
