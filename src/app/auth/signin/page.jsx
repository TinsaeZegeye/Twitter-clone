"use client";

import React, { useEffect, useState } from "react";
import SignInButton from "../../../../components/SignInButton";
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import { db } from "../../../../lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  const router = useRouter();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user?.displayName,
          email: user?.email,
          userImg: user?.photoURL,
          username: user.displayName?.split(" ").join("").toLocaleLowerCase(),
          uid: user?.uid,
        })
      }
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        className="object-cover md:w-44 md:h-80 rotate-6 hidden md:inline-flex"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxFxMTroISxErfbTAZsWIyqyz_LotLnBjGtw&s"
        alt="Twitter view inside phone"
      />

      <div>
          <div className="flex flex-col items-center">
            <img
              className="w-36 object-cover"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAACUCAMAAABY+0dBAAAAxlBMVEX///8AovMAo/L///3///sAovUAovf//f8Ao/D///n7//8Ao+78//z///cAoPYAn/IAmvAAnOX4//cAof16xu8AmuhBrO7//vJHqOIAl97s+/0AkesApu7h+Pad1Ovw/frN6PQAkueFyemXzOdiw+ROuN9luOV3wua65/cZnd4oot/g8/mX2e5NsuG76vR5w9q/3ee33t+p2eqo0fEAkclateqp4ffL6ep0uN+Hwu0aq+ee2OVswfO/4vYAl/gpn89mtvZ94PWqsSHeAAAK1UlEQVR4nO2dC3uayBrHmRsMwzCDEoixKARPjUp0z7Frk6Yx3f3+X+q8g0lvUYuJXSHL70n7JK1Q5s8772VutayWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWF0KI+YJf5PGnfyuECEKNDoS6xJL/UiFABQFCkFIIKan5jtJTP9UJgNb7575lCUppaQz+OXGcbZ/7xx/tn0UIn/Sz0X/e94Dx1TCDbkLEs48RUnslhCUdefhzCmEuBbcgJuPpRRSESmutlL6Y5QV4DJBHPH4MOo/0BZXyuTy1gjipY+z6UCHAHzhd0b+eRQwh+CrBGHvBu/kitVJhbigAKR2LpMUf//0tj388CMjgGi932GWO7LpELOaXCswAoa9CIFuh4HJcdInxGBv3CTLkndWg5n1DOOJ//cOFsNyugOYFnJd2AAqUQiDGvITjoLNMobM51HUpTbPci7wPB/8L/yxE0OLPvLsJfJUvAt9AZLaKmI1s27Qf4UebsJltYw+zzqcCAqnrptnwPgm4txrQevsI0qV5FA3hzbnVXxlkCpJmvcB4B8bQD2z+ACN8X9DBZDSOsbYR7gzrnmiRczFNQrx03UOEkJJkswBjtBsW9VbxNAoQw5yrcVpzg4AEaKltzZPM9Q8Swr0IE75LBFCIKeRp5DEbczCPqDivuxDEeh+FCVadyQGJMZFiHnodtkcIW9mJCplxpEr9uQBXJOucXUKZNIi5BhMHJXyTFFa5yKI0D3aq8L0gDNymDvnQaExcSCrqKgV4vYwjxc17iz52fXhnFSxY+DdJFR1AiCRBejqkvktkmo2K2lZjYAJLjkLP5AFhMEqN1Ve4Kr0Fo0f7XOWTEh4L4mXXkgOIop08rW/noGTEWSkE4yjKCyPEr5924qFqQtiMny0GN+tPqzv8btwnfk2FMGMHZwiHZZPgt85tQV2x32tCb0pz7VVQAWD87v3tKk40Ug+rTPp17RqQTdIzjZVplTEKFPUWkGsKd88DgxBFrPemEN8wvlKFCqGEx6ZAFzWNoT8KgZgd4k4OyfaWgZWvEOl+VHYlGeCmoeKcYaSVt3SreeKTQOH95ngjBGTG2PNCHMwWkA2Tst9su4bQ9CyqKgTHDCwN4tJ0ScmuO9YA4yNGnu2hRyG4yYTC6agAq4BYuqUOgyv8/r3GP1cYO7AR9zCUZbPP8lxYor5BAyLE0FPeD63iuDNf9mmZ/jxLsIggXeMiKgph6nObJ9O1sCqE5VNCyCL+qceDVeDkfpJCFbYlEQRxsg62q+mwqc+juzXt1tVNPkHooMfDn6onZjOd3GbS3VIoCUnXkacqRg1zs2iVCTNgWfeBGTkOkx9MwoQPeOHaG08s1wy8+lKawYSNKJLQ9SW4wGoqwI29vC8tp/7j+YQOFd4WBFjwoHpraapzp5yo2Bi368h1YFe1B/hgnJ22gZVxxJdwa7u8JMFBJ1/0fb8cuy91cIwQUVWDgJvoONsyzVFHqPVHsH2ERYXMQ+HlXb4oUvk4OG/5Fs2iKmVGCeYKLELU3VMaiBT9C/VtZuK7RkBaoRRDKriYny2zoi/MkK0vIGpsN6EtMBY2pmsQSfJgiw7IjC49tkYFUbK6Gn1Yl3L050HV+Ik1WETNveQTgpwXc2Uq5t32bYxD66gTx6vxOM/nvGpCBcEnzmoeN59wqEsmHW3vjgQmKwqUSRKZ0pGZ4bRtXq1zYKzjoiFCWMJJyfASnMGul8wAKJygqyAbYIwnVTNLhvWqaIAO5RoPCjlSN9cegiK0qsFXheFw3G+AEJak/UUBZaFIc7B5XrnnVye475+6kVWQNF3NIGfq0nQEiTY+thDY1p8akEOYykF8UkFyn0OecJ2oygljVZKQfzp1GysBdXauPBYGHQiMSfWSsipe6I1O3caqjBRnEAogTcAVY+IhQqh4cuoGVmUJ2YFJFSB82vrXTTsQHBenbmBViljbnkmnf0PIQCz5q+7rIp4g1jhIVDlvdXwXgRS/b0gRbhGyDMsRqeOrANj8Q10nt36G0P40NGs5focQGGpPum+2qEYQaf0RblY9/QYh7LvUPXULqyKtwUx9XR94TBUAfdacFerCoteX4W/wlEbbYHFe20UyPyMsv997KEfejy4Ei1K/IUHDMmuQrZs7pNVvSCPUmJCm5BHlzhP3Y0eXM+LHVIExHKx94TTHJIDuEDMN0c4+YvSAAmbaKBEMJB16ASrHpo/oNIO8Kd3iG7K7jANecYlYJRjWnawpofMJQl3ZLcaXNkiB0XFCqY2DedqQrPIbZoeem15P3yls20dJrhhj0cfzxgkhpEsEJf3rL53Q46FZB/daIZCKC6txQjgWcX2zuCddXE01nlVbYbzfIqJht+bLhZ4jiSOKLCsM2d93dvjqNJMx1SuI27SoAfWAWE7jeBXHsyDSr/aWDINBjLqHbxQ7NWb9wmAaIqU1O8aQHWMeGAQVjUmvnzBCkDzg9rHKcbjRyK37jtdd9C+4Pk7oRIn3MB9QE4lO3agXIPzhJUr462f9zKy5vlicW1bdt3Fth1pibjb1vtoiQEnv4faQbaT1gkg6mCr0eldp6pWZOJeNS6aecKU7mXG1cw9jVR2g2oo+nzcvYnwFHl0OEyjGzTp99PIylNtBLnyntnszqkBTUIKXq4ReFD7Kq1gwb8x85y6IK9dmbB/MG7/EJEohwll26na8HuH4g15UDkq8xCjKC6bD7qmb8XqI6xD6eaa18RTewUqAo+V6JN+AEAZKB3kPmmSrMLQ3naQqNrM7t6nbmDmd/TjUt9Kl2a3Jo8MMApxsuBpAjfE2hCBQIxDSHWTDD/mK40OmwLwoLiwpZWMmfvciLEf65QkjYjLnlReh2shDuleOWzey1nqOKcldAkIM8qmuuonNrNP2olXmy6aN4O+mfJ2QIC++qEPybU8/rMy5IW9ICCkt6g/eB8o7YL0htvVVUQ6Hn/r5j8Pm8EFRXEWB2aRRpRZl5RilivKBGYhp5hiEeDyNkzwezEmICy80zfJpZLZk7NnD8b0pYM658kapL0jtNzXuZLPpWUq6+Y6Sfra+997pykklYyawBLOJdGTjpjG+Qz4OG5THcQnIHc56KEC8+iI7EAIpbzzxXau+R+n8EvFkykQObiaj8V9xFGHFDhm4hIQrmA4H5+a81xO35uWQ6/l9brhdrXpx4mlTbIEKVTcqIZNGsWCeCdcVzXUPZhPwYnoZhop7CBkNDiw2IaZwL5he9xs3s/cMYaXXsyQpVyAfOhIDF3hIdSBoNm/y/xnknFqDPLYD+6Bq+1EIjbzxDXSKRmYOPwIFc5eQQd5DerPbEZenq/yiQ6ByKE9H8VlGXdGgBYT7McdlFMNxEmhTce/vIIzZNipVCDqrUWbO7noD5vCIMIctkWL9YRVFCbNRZ08OAX/hQZIRRL1P68J6O+XVVwTxSVpkeRy8ewjZLiGwOd5WB9Hd2aRIqdPgKZyt0PLEZgFJNu2m2fV8ehkFob3Z/bxJKDbfmfMTLi8vxteLtOtSNyVukzPqX0Fc0u8vr+YzrYPyGDazL5wh3omii7v51ecBlJdvpM7ej+MQyxxUJwY32Xo4yq9KRsPJzSB1y9PKanu42HERhFIHykj57ej0skI3P0JNRaodgfo2eBxTIOWpyOQr5gdpidqfgH9kthVQ5X800ODKqqWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpeW0/B+wj7IJapo5gAAAAABJRU5ErkJggg=="
              alt=" Twitter Logo"
            />

            <p className="text-center text-sm italic my-10">
              This app is created for learning purpose
            </p>
            <button onClick={onGoogleClick} className='bg-red-400 p-3 text-white hover:bg-red-500 rounded-lg cursor-pointer'>Sign in with Google</button>
          </div>
      </div>
    </div>
  );
}
