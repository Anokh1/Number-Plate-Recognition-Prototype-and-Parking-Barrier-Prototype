import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  // const imageUrl = "https://firebasestorage.googleapis.com/v0/b/marc-6d5c6.appspot.com/o/gurneyPlaza%2FBestResult.jpeg?alt=media&token=2a3cbe09-5e5e-4d23-8aa4-ce2cd6d039dc";
  // const imageUrl = "https://firebasestorage.googleapis.com/v0/b/reactrtdb.appspot.com/o/data%2Fphoto.jpg?alt=media&token=2ac4a7e2-7473-403f-92b6-3e50b29f5266";

  // this works
  // and it only needs the Firebase Storage image URL
  // there was issue with the “Access-Control-Allow-Origin” error

  // fake number plate
  // const imageUrl = `/o/gurneyPlaza%2FBestResult.jpeg?alt=media&token=2a3cbe09-5e5e-4d23-8aa4-ce2cd6d039dc`;

  // real number plate
  // incorrect results : PMY2734 instead of PMV2734
  // const imageUrl = `/o/gurneyPlaza%2FMyPlateInvertSuperZoom.jpeg?alt=media&token=a06040cf-2492-480c-8f53-7ba4fcd0ce59`;
  // const imageUrl = "/o/gurneyPlaza%2FMyPlateInvertSuperZoom.jpeg?alt=media&token=a06040cf-2492-480c-8f53-7ba4fcd0ce59";
  var storageImageUrl = "https://firebasestorage.googleapis.com/v0/b/marc-6d5c6.appspot.com/o/data%2Fphoto.jpg?alt=media&token=159659a1-9bc0-4510-8e2f-914ccb5d3449&_gl=1*irga0x*_ga*MTYzMTYyOTQ5NS4xNjgwMDg5MDc3*_ga_CW55HF8NVT*MTY5ODA3MTY4MC4xNjkuMS4xNjk4MDcxNjgzLjU3LjAuMA..";

  const imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAYAAADvCdDvAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3HWwtWXVx/EbGxMbFWkFSUWwULFbsQu7W8yxu7vHLrCwO7ALMDAoRUBRFBMssD3vfK73+Z65eYazn4f3rzPznj2zZ599x3Wva/3W+q24rn02Ofzww5f+/ve/T72WlpbGn312fJNNNhnHvP/zn/9M//3vf8fb397On+1sZxtvr3//+9/TP//5z3Hu/Oc//7jWvc6f/exnH2/fHf/rX/86Pt3TmP/4xz+m0047bfrXv/61LEtjuv4vf/nLuI/s5zvf+ZbH92xjn+Mc55jOec5zLj+PfL57n/vc517+mzzkm8ufjB0jg7/7nvy+eznv1feuTY/NoeP77bff/954Jq9NDjvssKW//e1vCwFJySmrzx74hz/8YVlg5yiTorwp3acxgNM9jlOwY5tuuuky0K4FhDGcd925znWucV+KNlaTdxzwAZohuQYo7tl8883HJzCM1TvALnzhCy8D51hgusdzLn7xi58BjAyvT9fPATmzv+dgbbrpposBSXFzL5l7iAfOPaMHppj5ZD04S2YZFJXCfae8zlO6Y6effvo41vXGOM95zjMs372nnnrqAJVX/PnPfx6A5X2uZVDkywLJO/cQMiRz18ytmIfMvQpgeZP7Ai6wArvvZFxpfHLxyLl8e+6558qAoKxcLsGjpgZhxQGSlTcBE2NhKdDDHZt7A4U1Rs/w3XO9Dz/88KFUSqZICjrvec87Jul6Y7sOEH/84x+nP/3pTwMYQLonCw+EPCAZXTf3qPWZYk5tjeFYHuL5c4DdD5QAyXjntNbfzrl/7jV77LHHyoAceuihSylpJUAMlgKjEccISbAXvvCFQ4EXuMAFhkXPJ+8a9+ZN8XNjOnfDG95weAElmwBF8Iaf/exn04knnjjoy/gXu9jFpotc5CLj7ygQUHMjiecDM2+bx6459UXH0U/nfHZsq622OoPHFA8Difeu73mNG+XOPWTXXXdd7CEp+cysyMOjkgDjBZTEkl/60pdOn/70p5c9iCIAI+BmSfPAzFqiGwpm3Q972MOmzTbbbNprr72mQw89dDryyCOnl7zkJeN+tMV7gHDpS196uu1tbzvd+c53nj7zmc9Mv/rVr6ZLXOIS0ymnnDKdfPLJ0w477DDAfM973jMdddRRwzIL2te61rWmZzzjGdOb3/zmoTzAkmObbbYZ11CuZ/ziF78Yn86Rz+dOO+00ZPjBD34wXfCCF5wudKELTb/73e/G/Onh8pe//BmSoJKVPCcDyks2CEgWVsCdB96CZlmW7ygBiBe96EWnV77yldO73/3uMUkCUOyOO+44FOJFYNc5j24Ix6IA5hiQKdWk7n3ve49jkoSnPvWpQ9FogXwUzRBudrObTQ984AOnb33rW9Ovf/3rASgqE3gp+Ygjjpje//73D4DmMW777befnvOc5wx5eR5Z3eceYwLmcpe73LjPs9CcsX0CBBgf//jHh9zFwEtd6lLDWAE9z04z3ABYn7J22223xR5SzAiIXLLjBMh9nSOwF4He+MY3Tm95y1uGsrx33nnn6cY3vvH0k5/8ZJnrA/z3v//9sHjjUiar++1vfzusEGiPeMQjpt12221Y68Mf/vDpmGOOWQYwCmHpT3va0waVnXTSSUMWY1z3utcdgL/1rW+dvvrVry6n4t13pStdaXrta187vexlL5u++MUvLhuEeeyxxx7T9a9//ena1772AIQRAYKh5AGM7sADDxxU6gXIvffee+jlsY997HLaXTnAsIpBZWHFrt13330xIHPPaMA5KAAJhMDxQNwKDBPN7ffZZ5/p0Y9+9HKNUCblPEDKuCgT5Rx99NHTt7/97SHrTW960+ma17zmUAQao+CsLBrZc889p2c/+9lDYejlN7/5zfCiq1/96tPXv/716RWveMW4r8yw+6561atOBx100DCgj3zkI8MLSzY87453vON0q1vdavr5z38+Yhm5zY8ernzlK08vf/nLpw984APjHBYg621uc5tBixijeqzkpVolQy6GmM8GPWQRIOX3BjZoGZl7ttxyyzMA4vytb33rIXzpb0GV0LIjigLqT3/60+lHP/rR9I1vfGNQDOVc5jKXmW5xi1tMu+yyy7A6SimuuR/VueaRj3zk8CiyGIMR+Pttb3vboBWy8lbHeKT7eIhzBxxwwPSxj31seBVr552Ud/e73326053uNABGS+S57GUvOwARu8S0L33pS0P2rbfeesSy613vesMYyDkHhG7mgMxrEOc2GEMWUVYeE0eaZBmOguv1r3/99M53vnNYiXMAwdP4mfsTlFUJhKWogr6sind84QtfGIBQGkulmKtc5SpD6a6ZdwPIAFCWibpQjViFrlj96173uun4448fVhtNlv3c4AY3GMEe9Xz+858f3uVdbUTB++233zLVAQUtAQa9vv3tbx8UysN33333EXcARh7Bf84sZXrzwnGeMO28886LKWtRUJ+DVbBiFSyFwJQPEBZhHBPH03mAewRnbu6eLbbYYtp2223H3wLlBz/4wemb3/zmoCYTu9vd7jbiyAMe8IDlVko1UFYvm7rLXe4y3ete9xo1jID8rGc9a/rwhz+83J5xTwqhDHT0pje9aXrXu941ff/73x/yyeZcR+kAvt3tbjeyqGIHI3Lus5/97ACRYTFCdMU7KvoqTKPX9T/nhaNzV7jCFf7vae+8Yq9GYIEUytKlvSaZslgOQH75y19Oxx577DjOpX3idkrHzTzoy1/+8khD8TlLRUcsVUb00Ic+dIDU8wEr6zEGBaMXXiSAb7fddoPi8g7PYyAUWo1whzvcYXrNa14zve997xvJgFjxne98Z1COv3fddddRD8nWZFvuB4x5Pu5xj5u+973vDXnIdte73nW6znWuMwyNDgr081pknqkCuZdrdthhh5UBOeSQQ0ZhaFAuSDGs2OTjWXRksgVIQruOy6MbgHhRgBTwHve4x3Bt7oymKIWSqqCB9alPfWq8xQDUlBWzVMcPPvjgQT2og9LmsavJiTe9xCLj8Io8OcNxzf777z8yN9fx5M997nPTd7/73QGO8QV9hnGf+9xnutGNbjQAkECgOHMyd4kEg+GdgGBAYo7xzI3RedWjM6fSdrqoNNhll10WA1LTTbD68Y9/PIQ0GRZwyUtecuThJ5xwwnJ+nksDBOXIbghLKJTl+gpDx1kbty4TAzS6ALKX9JnAN7/5zbnzsGKpqQkCMzpM+Qoy4LNUsjMKaTDw3VOG2KdreNCDH/zg6ZBDDhnGgoYUoeZANh4CEFRJ6bxbrACImqiaRJwRJ8lbUTrvAlRbkbWeWnE3QHbcccfFrRPewa14hgzkQx/60MiIZChy84c85CHDrU0Qj1IgyqHQj370o9MnPvGJM7Sv50IRjJIoy6uWQkGO5Zmgl2zJ+Ve96lVDcV6emZUFiIkCBI+zTjIUB4HFmHikeXmO65/whCdM973vfUeKTX6V/le+8pVh4QxExujvBz3oQaNABRTGkCZLpcUO46JKzzU+L2EwpfLrV+gVpuZQ55k8C4O6XlbuJEgDQ76NqwXim9zkJiN4ahV4IEDEAN7DyqWSJik1zCKd4yEEdayUuezD86StvAFf8yhujiJ46FOe8pTphz/84bjXPZQfBcrcepHXs3rxJEpkADIjRpVSxAHzkEjoCqBEXmhejI3xAeZ+97vfiE2OMSI1j1hDTmNLDqTQ9MBQoqW5DMWSjhV7M8KddtppsYewdkUbt5RG4nXCOK7yZsHcupaCCZkwl+cdXuiOtXvjcnGiHJ3SKKmuKWqLCgVklsbC1R+sVmGJgiqmeC45yPfJT35yyFWtERUCT7YlFQaE1gqlkQdlaLfwEF5trK997WuDask5n6/4wJs837WojmwKT7021TmDLJDXm2sJos5A3jIP5gAx1kLKskDF6lgEC8iK3QgcVKZSjSe5KG51PQsTgMUXCgaK7AMlACHuRwUUQ/jaCb67h6eo2D1X/cFDq/RNJqtHFRTx/Oc/fznGGYMnAwNV3f72tx9Kk73x3BbGql0EdXFCr42n8HBg8EYeTWaNy8c85jEDKPN/8pOfPAzjlre85Qj2UnY6qRAkQ50M16EyY81XO3kfGRiiz7322mvxAhXL03BjrR5WYaVR57tJO0ZpgjQrdL3AyPXl9QBj4Y9//ONH3GnZ03EeU6u+7vG8w4zyCAvMd7zjHcNC65l5JurUGGQY97znPUeB5jXPvigZ1cl80AxjKYj6vNrVrjY96UlPGorkSQyKIfIkgPAm3yUlaiGJjTlKlc1B5qggBUAtdXOscegaczJX1MdLi1+otaVjTLH33nsvBoQVerjA5sZaJNyW1XuwgTwQ+qxQYQUQlTYFoTzKoDg8y9paGGIhBG51kPUYB9D+rr0iWOqNUVyeFDBSaw1AGRBaKzYUzFXrWjaeIfvS3BR3UJrxKx4pEBPwFLRjLCkuBQrk4hlQ6MOczM84vEu/C5WbF4+kD/riiQyqpMfcyVGrvmWAkp0Ntk4IXc/KQ+bBl2JSSsGZ0IcddtjIVExGIAaY8y9+8YuH4tCBl0kTfh7g5tW/463pU6r2By+L7lqnUIXzkOc+97mjO+DFWusjSU3xvRRYzUFpUR7QFIbOUxQrliiQC0VKbX2v8+xvc6Foyr3GNa4x5sQQHS/Dqi5rbsZ2D9AA1DPoEy2Lu2TZd999N7yEWy8mi6vtMM+QSkMFRYAIsFoXPMnkKM/qoeIOIO7lCbn1vOo2VsBUq6A6gDzxiU9cXgZmgWKNtrrnohB9pbIrz3CfGEPp2jgorzS79XFtEek7j+QNYpe3xTWAUK6Mi9eSi2LbBWM87RwM4n5GJhEx5/lSteuBVcOyJMd4xuaVXhsEJMXEuSmuNK3Kt+t4iDpBzYKDBUCT49ooS9UraAKI9bcGEghzMPyNv9dx61C4WFBG4ris7gUveMEIxihE1xXVoBQJhMArLVXcveENbxhelKdTmnYNGlXUUQyFKuqk6jJFdAhYYIgjPus0u59M6hDzqBNcklKqn7zAcG+1B4MwNiNw77oCeMMLVHkEBcV1PWy+QAUU9YO0UZUOGBRgcgS2eCRPR2UVaAGyflc5V6cAE1eHKMKAWkPRcVmdzEcfSbAVv9773vcOY+A1ijeeRMm6z1rlVcfAcJ8sSatFMG+lUDotk9IppixvcQRormEMaJJnmUsbOCg1io5ZYo9aRRkEXbZK6ph799lnn40DpEDa4D2Mlbe5jKJYrNQS/7IwD+LOFI//ZVs8JI5tcSvPW/8TIDI994lB3l7ogOdRCusGOkWhE0oECLCiOFaM2tyfhbuHxwIDtUnRzYc38y50aw6SAIYlmIsl7jcf96lN0Cp9OFYam/GmrzaCFNeqo2SJsQxdbHDFcN6qLmYEhnOEaWWsBRpdVjWIlJdVAARoj3rUo4bVSplbHGr1LgHXBwSFZMnoRuskWqM0xRjFSB/JAmiKEyRRlXspmCeIIeJYgMioBOR99913eC7FV+RqkvIGb81G3gMw9EK5xrQ+c//7339QWe2kdmKy/tom7StrF8y8OhfcW7Ayr+22226xhxQr5n2m6MrAWVRBmqujKrSlmhVgHXPe0isuRwUCHwUGSDFqOeVa94fx0Q3lPf3pTx9xoJe0W1tcUUbx4kb9qpSmEciTxDarhjykYo2HABMgqFaKXsD3zJIOniVb5DG1QzxHs9EeAWC1aOV4m/va9hRV1ZWuYTvfLelvet1yyy0XAxKlzIN6IFEMiqiLSvmsVn9HhiWdY2EmDjx8i3pMru1A66e563uKSbBW4wrolNOL1VOonpprxA9A8BZe4Nk+ZWIUbn1FPZKFGlPrR1A3Fs8tJgLEWO4VuxiRrgKKQaHqCAbmEyDG1C3wHb3x7GoMOmqzH30Cyru6jv5ae99qq61WBuToo49ewsvt1CNg6xc1BlEPgNqwUI6NOqreTYYAikMCVfgRmMsGdlyawgPe9WjhuOOOG17HE1gdr6MgbRXeUn0hXpDDdSbrGcbgtbq/4oA5KQj1ocQaynR/8YEs7geIzI13mJP5osKKYnI4Xl3RLpJoXZbYtibzAbhrWyCrDR9422yzzWJAKLLd5ABxYzGjHpYHEawcu12KZWeUyXsSPppiyTKX6LAAWPNtHqsKkgCdbwfliSiRRRvf5OPqViPbjEYGabj5mBelmItlX/c77l7ye7baAFXynOjLM2p1uJ5n+l7HeT4Hf5dNFtSNG3jzLbKlwAsBOfLII5dMqtwZP7KYih7egru9TKSNYjXLKnrcQxECLS8hvOtxOxcvkM/jR95RZ9eY8yym7oGMzd/xseDacgDvaU2bpzAAzzR53kCh7kepQPPdWADxMpaGISCdb0djcSa6zvDc21Yf8nu37uJcXm386jDyzA17ISBHHHHEUtZEcXUvxQZxgJJRWm7KHb1MPi8AhkrYOLhVxsUrWHa/36gtneXlga28mWQtmtZn8kgTojDXtLUUIK7zbGPVN2t7KhkBVSfb3Cil3lnfXWOMlopZtpdn1xxkZHNASnhSsvgCgDZfG6NFOfrq5xRljttuu+3KlAWQllBZNGvVFsGp8nxBbk43BvW9Isk9ll413whEYcbTU5LxCMLzrZRdQyEm4Zy6JppiEDXlfHoOLyiAUrhnUkJdaGl2Hu5+4xbHqsrLcNxbf8w1JRyuA05r41G4+/zdit+cYmtwktFz82IJAUCTuTZMRrcw7UVZshNcqqYQFG3Lka/nigqzgpUHQd1DBEQuT2iFG8uQ8xsPGHpErqF0wp7ZRgVKcZxiokEKBYI36vMs91seUM2ThbHg/VLmrDmFVlnPq+qaphRZjyuv8d2zPENAN8f2Fhef1u9g5DVlXfaZCfCeqaPA69ChdZp6XMbdfvvtV/aQo446akn2wSv0plStFCDQSV99UkIriBTgTdFAU0gBUeCrUtdG19qwzmCSBJ233gnXekjpaTs1ooM+80jKoChVM4u0zCw2zF/rt2aiSXRWqs14elEo5ZmbpEGvzJqMN4B4IPnzhHmbpCDvOvRJf1hBlkhWzEJO26JstS0t3ihAZB86t5psCicgyPtZO0FNqK5mS7EUjI6kqNarCWZiqmQbyYxFKPEEhZVBxaMpzyR5WUDPKQR381zXiGlaIOocilY8qq7LpMhXzKlqdqyYV23Q4lurieYjrigqUR8wGGAZGO/oN5DpAIi8wlvyY9XRUjbFt6UJKHSHyq3le4Y50ttCDznmmGOWuJeWdltpWDtL1EZHH45XkfKCAqxUknAaegQiWE1GaxLWEbgwC5svVrmntLVkgfIph4sDWgvEsRIIf5NFPeET2IwAxbgnWuyHP4GSZZK/HhPlWE/nwRSq3iCHmsVmb88wz/pmFFktVceWkZU9Pu95zxvegTW8GHix14KbLoPvZFm3QLaYsmRSbbvJcqyaoSwCC6C5rs82JFO+iSsKxQsUQlmUbTFIyyFOLQ5EGZTDG3znBSyYEoDCW+3DdV4aap0bIKyO91Y3kY0SUxxDMVYLRNVOYiCQbZKrNdLvFllxMUM2BwyGxjOqIVoq9hyeY94CN0MWx3gryiIX+cnVD2Gt7+g0bDQggjo6QBs8A8omDwythqr0UjcPLCMxAUJbjGIJkgLnKeaZz3zmSIVNIpoof896eU5r9SzLc6XKwEWdmooWhgTFlnuNX6uH1Qr8ZGcEpaqN6ThZKMO6PaClwap8wHrzML0317ahgsKBYLz6ZSp/3lETlIFZxfQTB22kdVQ07qNDOiLri170orEWv9GASHvjdagL1DqphAVQKR1hCQF9lssauCzlasX7MQslEsikbX5m2ajKfe3SiNdLnSmPUgFnDG0PnibAoj3LpmTgUf1cmuVnieSIzioIzQcQskXei5rIpDYin7FlguZIwTZtUCLjIkt7cSm57BBgvIY3+cQoPAPI6cPmCJ5ng4WxsIW1nbMMCMEoirAAIRwwAor7USCLQSGUCJi28Ji4lTwuzJN8WlAiCMXMf+cxr2NqRZg0IKyVo0dKEcN0Wj2PdZo0BRlrXpj6m0WXtvrOGsljvQaVUHr1kYyy1JanVFySswLZ/FqO9dxo172KSDrSxJTptZ+Yl6Fp4Ev5GY95YIqzBIignqWblMnUi2EVXiyiQOwhvIXArMCGZR5SRW8srm27ThuYHZt3lE0YGI3jRzQUaI3FpBWa0kVZD6pqj1drNeX/rSqyeLQrTogRFIZGvCvWyCCT8hYj0GE/+OTF7UKpK8v4qpt8MowoHRCUzvDIwpCxgc6whTOeU6vecgLq3mjKOvbYY0cvi+AUxUo8AAgE7afIJu9cPSK5t8nbl0UR9W5kGO63ZCoTqbisqIpujIPKgG5BSj1DCdrk6hjpsjH7RwHVEbVVSqMphDLVQjYsoE3jdr3ntaBEqdgAKEAXwDEDEHhhnkC2NjiU4jJEzwGGDJC8nk1GK5G2Hkke/DzDeffTBcqii40G5LjjjhsxBCAEKbhFJ7IQ6SxvYIWsxTX+ZolWDeXuUk/3ozEKYIEmA9TWBOLkup7cnaAm0W9HuDcLLqNiJJ6d0RiLIpLXefSgqFWMkouCeVo/q3A9oyllddyWIzKzchYMEDK0JTRAjcWwPFdiwOJRtOvqJNhNCRTz8ruW4goqFdRlrGcJkDq2JgHVdoqYqIwH4kCgwIqjYo4syAIQ2tDldZzyajy2eQBl1N1lpThdV0Ds4GkyJj0tO+BleMagJJMkn/t5ZfQqzvFe47uWd4g/jAGf8zCeUo9JAVtriHKM6VqWbWMGi+ah5kkHjFCSwziAL5vyCywZZcWmufNm24SAbuXS/jCZorF5nA0YCmwJhfEZ+tZbb71yHYKyCMcSIGrSsgQxwVsBZfIUwyq4qEl6mbQtmhQpQKYsioha2mnhekA7jotlRvbfij8mzAplPjzLZ7xOrrq8lMUqjcFYAOI6x9owzZJrrbN+10Y3ninoMgBvHsuyUZgFMMHenLuet9OJHZp0YmOg817kbSWzn0erSQBix037joGIHjcakOOPP37JBEyctbE0HqH1DigKZXGsn+Xg4ap2KSDebKMbQasx/E053jyDAlMi69H2UPxRGiCBesUrXnFsRAC0MevmRp81Mlvnr+2BeozNy/JQysb57awvzZbSs3LNSSCiL55o6Ri1sPK6zMVRW1tRoes9h+dY55cJkjcKltGp2qXa7iWv+uwsecjJJ5+8RNGEZwn2WrEilIKGKIeAACHIvI3NKygSZbB+nlGqzOqrYdp4RimU5xzQca2x3ctC9ZBkPkBv/29KN2n3sfj5coBn8rgyQ7TazhQeLU2lcPMhPwYQA3gmBZbqy4wkFBqhrB+4PErSgnbM0TzIY0nYTkmtodZnGIIsUYJSkoOybB6XbW60h5x66qlLuE1w9lMynsFNPZQrs7CswgSrhlmggEr4/r1F51pnqDYgGC9xHRDRhbSRpeJoVtveWde00gYoCmNpFDT/v1Vt4AaO+MDrnKd8gLTQRH5ytSAGMNQDDMrnbeSwMUJCwRMYIQVXG0lein8MUOdA3PQ8QJmnT7/UBV4/CWTkDE9PcKMBOeWUU5ZwOUsgGIWoXMUGHNqaMwWgI+/28ZpMq3WtkRf0gZI1lwCw1sA3WZPA2+oMdQf6qx0+b4VQRpsGUAoFUTqgPR+V8C6ZUwUkeZ33bPRBaRSI3xWMxjE3Fs+idawp2vyAqBK3+4WcxjIfSY9ONjAYkmfxGuOSB9AA6PcuPjVtJSpA2qigfuKJJy7hOZ4hmLEAnwIrAQzSvt3S1mJI6TL0HUMbbSIoCXA/wX3nHZTJilgnGiwRMElZi2dEfS1c5Y2Uon/kzavEPMc81+83tLoDgmf1w9N+LsDz0ZXMUSvFNRkXCiIDWQVuqThaww6om9IplhcZx4tcLXr10wWUXwveOABhaBsNiOaiPNoggioQ+ldHsoMadVXahChQV91SNgs2GbzLWuoO91MH9wBALq9F4jhBWSQQ/e5DulvN4Xn1v0y6xEMiIAUlIw+QQvtb28KuSfegMHJ6A4hiyGNuCkidAV7JGBif4yhTUAeergFwjS8LQ7ESGGDYcMeLeRrvqA0PEBmpZIUR8jy64DGMe6MBOeigg5bs9KOUNiRQHE/RusCneLkeFMW2TNoyaL/KpQDAyFzQBMBYMmU6zkPEKWsnVf5AkFRYM2B5bUATG1ozcS26A5Jag3dZmUM7lAVExSnKQbWUX3JRoxEVAx+YrJZc1kFQTyuF5qrAdJ4y19UMg1qj5FYNWx/33RzK4sy5jXjuQcn9PpEBoLGFG+UOOOCAJdyHdky2WqHtODxEZuLBvVrSbBsMIQhI6bqzXF9ubgxWVIHG7Vmn7MrLcZORVVmhlIExjH7z3jNRj8nMg71xeQJgLJBRuInL1urkep77AGhM3qn1IS1Fw+oImRJQKI4RiRkah4BuV2NZXb0zcgVIQLnG/ItVdMNzHeMxClCpMrA233zzlQvDAw88cIn7mRyLo5CaePO2+XyNO+truZUltW5NGfiYgilahuR8i1E8RHpYJY8K+vl1OxPbBeiePNMnJdRb8p2Vi0l23JfhUTRgvQHi2RTDMlXQ/dBHEmEjtWSAjG2cixJRDF2UzJRlpYfm7ni03sYKnkae/omb4/5pQf/hYrPNNlsZkIMPPngJlbRHFxhtt28DHa/JGxJkvr4hPZahtZ+X1fEUykN3LSLhZIGSEvuZG7pynRZEWz3bLupZdXYrONEWq0ed9cJkSSavFcOwavdHL/PahSehNw0/2WS1SdfIrtr/K6CXYc2NsHHnBklOXgvIFvEYDMNAieITnayrl1YG5IQTThi7TlwI1ZprZVClkQFyZpbCoi0q8TTjqOxlTAQjJAXiZKBTGOVqe9QTolgUx7JKAtoH5ZNVz1vubVgouXAPWhKweQH6ZfUU6kUO3to2InEGTdWWEauMT8420rm+e1vpjLLn9J3nkwnDoDxzpRNgasuLx57XM/pbAAAB10lEQVTlRR9bbLHFyoCcdtppS/N2A8FanPHgNrAlTFYxd905fbi3RaCozOQIKdsBOjBa/hV/xCgg8qToqiXj+lal0dUn5MLPqMYkAYCajNUuEde0FaiVSWzg+S3R1pzkVW35rOYxx+h7Pv8AYZyl9M5rXr761a8eTGFcBuDHRDyRXjQ1Gc/Cfxxw+umnj+Zie6Vat5i3u+dZRrxOgLymjQaUW0CmqHpOtfVZusnKpoDFGiUSYpXMzHi1wN3DUByrfe/vloBrv7cNKFnmiYcx6qOlxBKS9olFby3Rtj7SrpN+S5ghzrM3xwKFByiu1XT9RAL40nEUafz+tdTCbUBaJx7SnqGooo1srT3MBXGs61igh/ke7UVFvKEtNI4BS/raPi1BE886JwD7LAkoxnhWP4OIQqKqMpxAcy2FAtizSwgo16t03fVkyTt4TFV73ekMhmGl9PVZouPuN389QBlr9xgDZVXskm1df21lyuoha5+rQwMrIrU6xPv/J8UaIKsM8zVA1gBZZRpYZeKsecgaIKtMA6tMnDUPWQNklWlglYmz5iFrgKwyDawycdY8ZA2QVaaBVSbOmoesAbLKNLDKxFnzkDVAVpkGVpk4ax6yBsgq08AqE+d/AD/XUCJyClMPAAAAAElFTkSuQmCC";

  const handleClick = () => {
    setIsLoading(true);
    Tesseract.recognize(
      // image,
      // imageUrl to test whether OCR can be performed by providing the link
      // of the image in .jpeg format from Firebase Storage
      imageUrl, 
      'eng',
      {
        logger: m => {
          console.log(m);
          if (m.status === "recognizing text") {
            setProgress(parseInt(m.progress))
          }
        }
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setIsLoading(false);
      // text datatype is string 
      // console.log(text); // the number plate recognition result 
      var numberPlateText = '';
      var numberPlateString = '';
      var numberPlateStringCharacter = '';
      var numberPlateStringNumber = 0;
      let numberCharacterArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; 
      // text.length > 7
      if (text[0] != "P") {
        console.log("Detection Failed!");
        let i = 0;
        while (text[i] != "P") {
          i++;
        }
        console.log(i);
        // var numberPlateString = text.slice(0,i+1); // get '-P' 
        var numberPlateStringCharacter = text.slice(i, i+3); // get 'PMV2734...' 
        console.log(numberPlateStringCharacter);
        //if (typeof text[5] != "number") {
        if (numberCharacterArray.includes(text[i+4])) {
          var numberPlateStringNumber = text.slice(i+4, i+9); 
          console.log('Perfect code')
          console.log(numberPlateStringNumber) // perfect code 
          // let j = 0 + i+7;
          // while (numberCharacterArray.includes(text[j])) {
          //   j++;
          // }
          // console.log(j);
          // var numberPlateStringNumber = text.slice(j, j+4); 
          // console.log(numberPlateStringNumber); 
        } else {
          console.log("Number Detection Failed!")
          let j = 0 + i + 4;
          while (numberCharacterArray.includes(text[j])) {
            j++;
          }
          console.log(j);
          var numberPlateStringNumber = text.slice(j, j+5); 
          console.log(numberPlateStringNumber); 
        }
      } else { // if the number plate character is perfect 
        var numberPlateText = text;
        console.log('Number plate is perfect')
        console.log(numberPlateText);
      }

      console.log(numberPlateStringNumber[1]); 

      numberPlateString = numberPlateStringCharacter.concat(numberPlateStringNumber); 
      console.log(numberPlateString); 
    })

    // Malaysia Number Plate Specification according to JPN
    // 1. White letters and numbers are affixed or bounced over a black frame. 
    // Penang Number Plate should start with 'P' 
    // Number plate character should be 7 characters
    // First character = "P", Last character = integer type

  }

  // FROM THE Tesseract npm website
  // Tesseract.recognize(
  //   'https://tesseract.projectnaptha.com/img/eng_bw.png',
  //   'eng',
  //   { logger: m => console.log(m) }
  // ).then(({ data: { text } }) => {
  //   console.log(text);
  // })

  return (
    <div className='container' style={{ height: "100vh" }}>
      <div className='row h-100'>
      {/* <img id="image"
        src={ storageImageUrl }
        // src="https://firebasestorage.googleapis.com/v0/b/marc-6d5c6.appspot.com/o/data%2Fphoto.jpg?alt=media&token=159659a1-9bc0-4510-8e2f-914ccb5d3449&_gl=1*irga0x*_ga*MTYzMTYyOTQ5NS4xNjgwMDg5MDc3*_ga_CW55HF8NVT*MTY5ODA3MTY4MC4xNjkuMS4xNjk4MDcxNjgzLjU3LjAuMA.."
        ></img> */}
        <div className='col-md-5 mx-auto d-flex flex-column align-items-center'>
          {!isLoading && <h1 className='mt-5 mb-5 pb-5'>Image to Text</h1>}

          {/* form */}
          {
            !isLoading && !text && (
              <>
                <input type='file' className='form-control mt-5' onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}></input>
                <input type='button' className='form-control btn btn-primary mt-4' value="Convert" onClick={handleClick}></input>
              </>
            )
          }

          {/* progress bar */}
          {isLoading && (
            <>
              <p className='text-center mt-5'>Converting :- {progress}</p>
            </>
          )}
          {/* text area */}
          {!isLoading && text && (
            <textarea className='form-control' rows="15" value={text} onChange={(e) => setText(e.target.value)}></textarea>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
