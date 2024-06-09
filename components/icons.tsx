import { LucideIcon, LucideProps, Moon, SunMedium } from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  logo: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='51'
      height='51'
      viewBox='0 0 51 51'
      fill='none'
      {...props}
    >
      <path
        d='M18.6779 16.2382C20.1317 15.6459 21.8009 17.1267 21.424 18.6344C21.0471 20.1421 18.9471 20.842 17.8702 19.6844C16.7933 18.5267 17.2779 16.669 18.6779 16.2382Z'
        fill='#00B887'
      />
      <path
        d='M32.7585 25.0714C34.1585 24.4791 35.8277 25.7984 35.5585 27.2791C35.2893 28.7599 33.4316 29.6483 32.247 28.733C31.0624 27.8176 31.2239 25.5291 32.7585 25.0714Z'
        fill='#FFCE00'
      />
      <path
        d='M21.2352 0.322341C35.0197 -1.88596 47.9696 7.48586 50.1773 21.2743C51.685 30.6192 47.835 40.0179 40.1889 45.6195C36.7159 48.2048 32.6236 49.8206 28.3429 50.3054C15.5545 51.8943 3.62769 43.5997 0.666178 31.0501C-0.653042 25.3677 -0.00689391 19.4161 2.55078 14.1646C6.05075 6.89339 13.2392 1.53421 21.2352 0.322341ZM21.7737 2.47678C9.20072 4.38885 0.558486 16.1575 2.47001 28.734C4.38153 41.3106 16.1468 49.9553 28.7198 48.0432C41.2928 46.1312 49.935 34.3625 48.0235 21.786C47.6196 19.0391 46.7043 16.4268 45.3581 14.003C43.2581 10.2866 40.162 7.21655 36.4467 5.11597C31.9775 2.63837 26.8352 1.6958 21.7737 2.47678Z'
        fill='#111827'
      />
      <path
        d='M27.5891 20.0355C26.0814 19.1737 24.4391 18.6621 22.7699 18.1773H22.4737C22.4737 18.6082 22.4468 19.0391 22.3391 19.443C26.1352 20.251 29.2044 22.0014 31.6813 24.9907L32.7852 24.2367C31.1698 22.4054 29.7429 21.1666 27.5891 20.0355Z'
        fill='#00B887'
      />
      <path
        d='M34.1313 12.6027C27.2122 7.75516 17.6545 9.45179 12.8354 16.3729C8.01616 23.2941 9.68538 32.8544 16.6046 37.7019C19.9699 40.1526 24.1968 41.0952 28.2891 40.3142C36.5544 38.8061 42.0466 30.9154 40.5928 22.6477C39.8928 18.5543 37.5505 14.9187 34.1313 12.6027ZM37.7928 20.8165C37.0121 20.0355 36.1775 19.2814 35.3159 18.6082C35.1275 17.6656 34.8582 16.7769 34.589 15.8882C35.989 17.2886 37.0928 18.9583 37.7928 20.8165ZM22.7699 17.5848C26.0814 16.6961 29.7429 16.9115 32.8121 18.5004C33.2698 18.7967 33.889 18.9852 34.2121 19.443C34.4813 20.9511 34.2929 22.4862 34.0236 23.9673L35.1813 24.3444C35.4775 22.9978 35.5852 21.6513 35.5044 20.2779C36.6352 21.4089 37.7928 22.5939 38.4928 24.0751C38.7621 26.9836 38.0621 29.8921 36.4467 32.3427C36.2582 31.3463 35.989 30.3229 35.6929 29.3534L34.589 29.9728C34.9929 31.2117 35.289 32.4505 35.4505 33.7431C34.7236 34.4972 33.9698 35.1974 33.1621 35.8437C31.5467 35.8437 29.9314 35.5475 28.4237 34.9819C28.2352 35.332 28.0198 35.6821 27.8314 36.0591C28.9621 36.4631 30.1467 36.7593 31.3314 36.9479C26.916 39.21 21.2622 38.5906 17.4122 35.4667C19.243 35.8706 21.1276 35.9514 22.9853 35.736C22.7968 35.332 22.6622 34.955 22.5007 34.578C20.1045 34.8742 17.6815 34.5241 15.5007 33.5277C14.6123 32.639 14.02 31.454 13.4815 30.296C13.1046 29.5689 13.293 28.734 13.4277 27.9531C14.02 25.0715 15.5007 22.4592 17.6815 20.4933C17.4122 20.1971 17.1699 19.8739 16.9007 19.5507C14.8546 21.4089 13.3469 23.8058 12.5661 26.4449C12.2969 24.1289 12.7007 21.8129 13.7507 19.7392C14.693 19.3084 15.7161 19.1737 16.7122 18.9852C16.6584 18.5812 16.6315 18.1503 16.6046 17.7464L14.5315 18.2042C16.3084 15.5381 18.9738 13.5722 22.043 12.6835C21.3968 13.4914 20.7776 14.3262 20.2391 15.2149L21.3699 15.6997C22.1237 14.4339 23.0391 13.3029 24.143 12.3334C26.6737 12.0102 29.2044 12.4949 31.466 13.6529C33.0275 14.3531 33.2967 16.2921 33.9429 17.7195C30.3621 15.7266 26.1083 15.2957 22.2045 16.5076C22.393 16.8308 22.4737 17.2078 22.4737 17.5848'
        fill='#111827'
      />
      <path
        d='M17.8159 20.8165L19.0812 21.005C18.7582 25.1254 20.2389 29.1919 23.1466 32.1542C22.8774 32.4774 22.6081 32.8544 22.3658 33.2045C19.1082 29.9459 17.4389 25.4216 17.8159 20.8165Z'
        fill='#01B6D3'
      />
      <path
        d='M27.9659 32.9073C29.4198 31.965 30.6852 30.7804 31.7351 29.4342L32.8121 30.1881C31.5736 31.7496 30.1198 33.0957 28.4506 34.1727L27.9659 32.9073Z'
        fill='#FFCE00'
      />
      <path
        d='M24.3586 32.208C25.9201 31.3196 27.9124 33.1503 27.2124 34.7926C26.5124 36.4349 24.6278 36.6503 23.6586 35.4657C22.6893 34.2811 23.1201 32.7195 24.3586 32.208Z'
        fill='#01B6D3'
      />
      <path
        d='M14.1544 6.1663L16.2275 5.22373C16.4698 5.08908 16.7659 5.00829 17.0352 4.98135C17.2775 4.92749 17.5198 4.95442 17.7621 5.00829C18.0044 5.08908 18.1928 5.1968 18.3813 5.35838C18.5967 5.5469 18.7582 5.78927 18.8659 6.05858C19.1621 6.67798 19.2159 7.18966 19.0275 7.62055C18.839 8.05143 18.4352 8.3746 17.8429 8.64391L17.089 8.994L17.8698 10.7176L16.5236 11.337L14.1544 6.1663ZM16.6044 7.91678L16.8198 7.80906L17.1698 7.64748C17.2775 7.59362 17.3582 7.51282 17.439 7.43203C17.5198 7.37817 17.5736 7.27045 17.5736 7.16273C17.6005 7.00114 17.5736 6.86649 17.4929 6.73184C17.439 6.59719 17.3582 6.48946 17.2505 6.40867C17.1698 6.32788 17.0621 6.30095 16.9544 6.30095C16.8467 6.30095 16.7121 6.32788 16.6044 6.38174C16.4698 6.40867 16.3352 6.46253 16.2275 6.54332L16.0121 6.62412L16.6044 7.91678Z'
        fill='#111827'
      />
      <path
        d='M24.6277 7.99759L24.2239 8.99402L22.6624 8.94016L25.0046 3.31168L26.62 3.36554L28.5854 9.10174H27.0239L26.6739 8.07838L24.6277 7.99759ZM25.7585 5.08909L25.0854 6.89344H26.2969L25.7585 5.08909Z'
        fill='#111827'
      />
      <path
        d='M33.7002 4.90051L35.2887 5.78922V7.48584L36.7694 6.651L38.3309 7.5397L35.4771 8.94009L35.8002 12.6296L34.2656 11.7409L34.131 9.53256L32.0848 10.5021L30.5233 9.64028L33.9694 8.07831L33.7002 4.90051Z'
        fill='#111827'
      />
      <path
        d='M38.4124 15.8061L37.4971 14.6484L41.9663 11.1484L42.8816 12.3061L38.4124 15.8061Z'
        fill='#111827'
      />
      <path
        d='M45.6543 16.9654L46.0312 18.3927L43.3658 21.8937L46.7312 21.005L47.1081 22.4323L41.5889 23.9135L41.2389 22.4592L43.9043 18.9852L40.5389 19.8739L40.162 18.4466L45.6543 16.9654Z'
        fill='#111827'
      />
      <path
        d='M40.9427 29.1913L41.2389 27.7375L45.6004 28.599L45.8158 27.4144L47.0542 27.6567L46.3004 31.5067L45.0619 31.2375L45.3043 30.0529L40.9427 29.1913Z'
        fill='#111827'
      />
      <path
        d='M36.9855 36.7324L38.0355 35.2243L40.6201 35.332H40.647L38.8432 34.0662L39.6778 32.8544L44.3623 36.113L43.097 37.9442C42.9354 38.1597 42.747 38.3482 42.5585 38.5098C42.37 38.6714 42.1547 38.7791 41.9393 38.8599C41.7239 38.9137 41.4816 38.9137 41.2662 38.8868C40.997 38.8329 40.7547 38.6983 40.5124 38.5636C40.3508 38.4559 40.2162 38.3213 40.1085 38.1597C40.0008 38.025 39.8931 37.8634 39.8393 37.7019C39.7316 37.3518 39.7585 36.9747 39.9201 36.6246L36.9855 36.7324ZM41.4277 35.8706L41.347 35.9783C41.2662 36.086 41.2124 36.1938 41.1585 36.3015C41.0777 36.3823 41.0508 36.5169 41.0508 36.6246C41.0239 36.7324 41.0239 36.8401 41.0778 36.9478C41.1047 37.0555 41.2124 37.1363 41.3201 37.244C41.4277 37.3248 41.5624 37.3787 41.697 37.3787C41.8047 37.3787 41.9124 37.3518 41.9931 37.2979C42.1008 37.244 42.1816 37.1633 42.2624 37.0825L42.5047 36.8132L42.5854 36.6785L41.4277 35.8706Z'
        fill='#111827'
      />
      <path
        d='M34.2926 39.9372L34.158 38.8869L35.5311 38.1328L36.3388 44.1922L34.9388 44.9462L30.335 40.9874L31.708 40.2334L32.5157 40.9336L34.2926 39.9372ZM34.8042 43.0342L34.4811 41.176L33.4042 41.7415L34.8042 43.0342Z'
        fill='#111827'
      />
      <path
        d='M27.9391 47.1815H25.8392C25.4622 47.2084 25.0584 47.1276 24.7084 46.9929C24.3584 46.8583 24.0623 46.6698 23.793 46.4005C23.5238 46.1581 23.3084 45.8619 23.1469 45.5118C22.9853 45.1617 22.9046 44.7846 22.9046 44.4076C22.8776 44.0306 22.9584 43.6266 23.093 43.2765C23.2546 42.9264 23.443 42.6302 23.7123 42.3609C23.9815 42.0916 24.2776 41.9031 24.6276 41.7415C24.9776 41.6068 25.3546 41.526 25.7315 41.4991H27.8315L27.9391 47.1815ZM26.3776 42.7648H26.0276C25.8122 42.7648 25.5969 42.7918 25.4084 42.8726C25.2199 42.9264 25.0315 43.0342 24.8969 43.1688C24.7623 43.3035 24.6276 43.465 24.5469 43.6536C24.4661 43.8959 24.4392 44.1383 24.4392 44.3807C24.4392 44.6231 24.493 44.8385 24.5738 45.0539C24.6546 45.2425 24.7622 45.404 24.9238 45.5387C25.0584 45.6733 25.2469 45.7811 25.4353 45.8349C25.6507 45.9157 25.8661 45.9427 26.0815 45.9427H26.4315L26.3776 42.7648Z'
        fill='#111827'
      />
      <path
        d='M17.0084 44.2999L17.3853 43.4381L15.8507 42.7649L16.3623 41.6338L17.87 42.307L18.2738 41.3914L16.6584 40.6912L17.17 39.5332L20.1315 40.8259L17.87 46.0504L14.9084 44.7577L15.3931 43.6266L17.0084 44.2999Z'
        fill='#111827'
      />
      <path
        d='M5.88919 22.4323C6.1315 23.1594 6.37381 23.8865 6.58919 24.6137H8.90455L7.04688 25.9602C7.26226 26.6873 7.50457 27.4144 7.74687 28.1416L5.88919 26.795L4.03152 28.1416L4.75843 25.9602L2.90076 24.6137H5.1892C5.4315 23.8865 5.64689 23.1594 5.88919 22.4323Z'
        fill='#111827'
      />
      <path
        d='M7.10074 29.919C7.34305 30.6461 7.58535 31.3733 7.80074 32.1004H10.1161L8.25842 33.4469C8.47381 34.174 8.71611 34.9012 8.95842 35.6283L7.10074 34.2818L5.24306 35.6283L5.96998 33.4469L4.1123 32.1004H6.40075C6.64305 31.3733 6.85844 30.6461 7.10074 29.919Z'
        fill='#111827'
      />
      <path
        d='M11.9201 36.1669C12.1624 36.894 12.4047 37.6211 12.6201 38.3482H14.9085L13.0508 39.6678L13.7778 41.8492L11.9201 40.5027L10.0624 41.8492L10.7893 39.6678L8.93164 38.3482H11.2201C11.4624 37.6211 11.6778 36.894 11.9201 36.1669Z'
        fill='#111827'
      />
      <path
        d='M7.74662 14.5686C7.98892 15.2957 8.23123 16.0228 8.44661 16.7499H10.762L8.9043 18.0965C9.11968 18.8236 9.36199 19.5507 9.60429 20.2778L7.74662 18.9313L5.88894 20.2778L6.61586 18.0965L4.75818 16.7499H7.04662C7.28893 16.0228 7.53123 15.2957 7.74662 14.5686Z'
        fill='#111827'
      />
      <path
        d='M11.3546 8.32071C11.57 9.04783 11.8123 9.77496 12.0546 10.5021H14.343L12.4854 11.8486C12.7277 12.5757 12.943 13.3029 13.1853 14.03L11.3546 12.6565L9.49692 14.03C9.73922 13.3029 9.95461 12.5757 10.1969 11.8486L8.33923 10.5021H10.6277L11.3546 8.32071Z'
        fill='#111827'
      />
    </svg>
  ),
  star: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='17'
      viewBox='0 0 20 17'
      fill='currentColor'
      {...props}
    >
      <path
        d='M6.75 3C6.75 2.82741 6.61009 2.6875 6.4375 2.6875C5.40196 2.6875 4.5625 1.84804 4.5625 0.8125C4.5625 0.63991 4.42259 0.5 4.25 0.5C4.07741 0.5 3.9375 0.63991 3.9375 0.8125C3.9375 1.84804 3.09804 2.6875 2.0625 2.6875C1.88991 2.6875 1.75 2.82741 1.75 3C1.75 3.17259 1.88991 3.3125 2.0625 3.3125C3.09804 3.3125 3.9375 4.15196 3.9375 5.1875C3.9375 5.36009 4.07741 5.5 4.25 5.5C4.42259 5.5 4.5625 5.36009 4.5625 5.1875C4.5625 4.15196 5.40196 3.3125 6.4375 3.3125C6.61009 3.3125 6.75 3.17259 6.75 3Z'
        fill='url(#paint0_linear_1210_2658)'
      />
      <path
        d='M6.75 3C6.75 2.82741 6.61009 2.6875 6.4375 2.6875C5.40196 2.6875 4.5625 1.84804 4.5625 0.8125C4.5625 0.63991 4.42259 0.5 4.25 0.5C4.07741 0.5 3.9375 0.63991 3.9375 0.8125C3.9375 1.84804 3.09804 2.6875 2.0625 2.6875C1.88991 2.6875 1.75 2.82741 1.75 3C1.75 3.17259 1.88991 3.3125 2.0625 3.3125C3.09804 3.3125 3.9375 4.15196 3.9375 5.1875C3.9375 5.36009 4.07741 5.5 4.25 5.5C4.42259 5.5 4.5625 5.36009 4.5625 5.1875C4.5625 4.15196 5.40196 3.3125 6.4375 3.3125C6.61009 3.3125 6.75 3.17259 6.75 3Z'
        fill='#73a3ff'
        fillOpacity='0.4'
      />
      <path
        d='M6.75 3C6.75 2.82741 6.61009 2.6875 6.4375 2.6875C5.40196 2.6875 4.5625 1.84804 4.5625 0.8125C4.5625 0.63991 4.42259 0.5 4.25 0.5C4.07741 0.5 3.9375 0.63991 3.9375 0.8125C3.9375 1.84804 3.09804 2.6875 2.0625 2.6875C1.88991 2.6875 1.75 2.82741 1.75 3C1.75 3.17259 1.88991 3.3125 2.0625 3.3125C3.09804 3.3125 3.9375 4.15196 3.9375 5.1875C3.9375 5.36009 4.07741 5.5 4.25 5.5C4.42259 5.5 4.5625 5.36009 4.5625 5.1875C4.5625 4.15196 5.40196 3.3125 6.4375 3.3125C6.61009 3.3125 6.75 3.17259 6.75 3Z'
        fill='url(#paint1_linear_1210_2658)'
      />
      <path
        d='M6.75 3C6.75 2.82741 6.61009 2.6875 6.4375 2.6875C5.40196 2.6875 4.5625 1.84804 4.5625 0.8125C4.5625 0.63991 4.42259 0.5 4.25 0.5C4.07741 0.5 3.9375 0.63991 3.9375 0.8125C3.9375 1.84804 3.09804 2.6875 2.0625 2.6875C1.88991 2.6875 1.75 2.82741 1.75 3C1.75 3.17259 1.88991 3.3125 2.0625 3.3125C3.09804 3.3125 3.9375 4.15196 3.9375 5.1875C3.9375 5.36009 4.07741 5.5 4.25 5.5C4.42259 5.5 4.5625 5.36009 4.5625 5.1875C4.5625 4.15196 5.40196 3.3125 6.4375 3.3125C6.61009 3.3125 6.75 3.17259 6.75 3Z'
        fill='#73a3ff'
        fillOpacity='0.4'
      />
      <path
        d='M14.25 2.5C14.25 2.22386 14.0261 2 13.75 2C13.4739 2 13.25 2.22386 13.25 2.5C13.25 4.98488 11.2352 7 8.75 7C8.4739 7 8.25 7.2239 8.25 7.5C8.25 7.7761 8.4739 8 8.75 8C11.2353 8 13.25 10.0142 13.25 12.5C13.25 12.7761 13.4739 13 13.75 13C14.0261 13 14.25 12.7761 14.25 12.5C14.25 10.0141 16.2641 8 18.75 8C19.0261 8 19.25 7.7761 19.25 7.5C19.25 7.2239 19.0261 7 18.75 7C16.2642 7 14.25 4.98492 14.25 2.5Z'
        fill='url(#paint2_linear_1210_2658)'
      />
      <path
        d='M14.25 2.5C14.25 2.22386 14.0261 2 13.75 2C13.4739 2 13.25 2.22386 13.25 2.5C13.25 4.98488 11.2352 7 8.75 7C8.4739 7 8.25 7.2239 8.25 7.5C8.25 7.7761 8.4739 8 8.75 8C11.2353 8 13.25 10.0142 13.25 12.5C13.25 12.7761 13.4739 13 13.75 13C14.0261 13 14.25 12.7761 14.25 12.5C14.25 10.0141 16.2641 8 18.75 8C19.0261 8 19.25 7.7761 19.25 7.5C19.25 7.2239 19.0261 7 18.75 7C16.2642 7 14.25 4.98492 14.25 2.5Z'
        fill='#73a3ff'
        fillOpacity='0.4'
      />
      <path
        d='M14.25 2.5C14.25 2.22386 14.0261 2 13.75 2C13.4739 2 13.25 2.22386 13.25 2.5C13.25 4.98488 11.2352 7 8.75 7C8.4739 7 8.25 7.2239 8.25 7.5C8.25 7.7761 8.4739 8 8.75 8C11.2353 8 13.25 10.0142 13.25 12.5C13.25 12.7761 13.4739 13 13.75 13C14.0261 13 14.25 12.7761 14.25 12.5C14.25 10.0141 16.2641 8 18.75 8C19.0261 8 19.25 7.7761 19.25 7.5C19.25 7.2239 19.0261 7 18.75 7C16.2642 7 14.25 4.98492 14.25 2.5Z'
        fill='url(#paint3_linear_1210_2658)'
      />
      <path
        d='M14.25 2.5C14.25 2.22386 14.0261 2 13.75 2C13.4739 2 13.25 2.22386 13.25 2.5C13.25 4.98488 11.2352 7 8.75 7C8.4739 7 8.25 7.2239 8.25 7.5C8.25 7.7761 8.4739 8 8.75 8C11.2353 8 13.25 10.0142 13.25 12.5C13.25 12.7761 13.4739 13 13.75 13C14.0261 13 14.25 12.7761 14.25 12.5C14.25 10.0141 16.2641 8 18.75 8C19.0261 8 19.25 7.7761 19.25 7.5C19.25 7.2239 19.0261 7 18.75 7C16.2642 7 14.25 4.98492 14.25 2.5Z'
        fill='#73a3ff'
        fillOpacity='0.4'
      />
      <path
        d='M5.25 9C5.25 8.7239 5.02614 8.5 4.75 8.5C4.47386 8.5 4.25 8.7239 4.25 9C4.25 10.6569 2.90686 12 1.25 12C0.97386 12 0.75 12.2239 0.75 12.5C0.75 12.7761 0.97386 13 1.25 13C2.90686 13 4.25 14.3431 4.25 16C4.25 16.2761 4.47386 16.5 4.75 16.5C5.02614 16.5 5.25 16.2761 5.25 16C5.25 14.3431 6.59314 13 8.25 13C8.5261 13 8.75 12.7761 8.75 12.5C8.75 12.2239 8.5261 12 8.25 12C6.59314 12 5.25 10.6569 5.25 9Z'
        fill='url(#paint4_linear_1210_2658)'
      />
      <path
        d='M5.25 9C5.25 8.7239 5.02614 8.5 4.75 8.5C4.47386 8.5 4.25 8.7239 4.25 9C4.25 10.6569 2.90686 12 1.25 12C0.97386 12 0.75 12.2239 0.75 12.5C0.75 12.7761 0.97386 13 1.25 13C2.90686 13 4.25 14.3431 4.25 16C4.25 16.2761 4.47386 16.5 4.75 16.5C5.02614 16.5 5.25 16.2761 5.25 16C5.25 14.3431 6.59314 13 8.25 13C8.5261 13 8.75 12.7761 8.75 12.5C8.75 12.2239 8.5261 12 8.25 12C6.59314 12 5.25 10.6569 5.25 9Z'
        fill='#73a3ff'
        fillOpacity='0.4'
      />
      <path
        d='M5.25 9C5.25 8.7239 5.02614 8.5 4.75 8.5C4.47386 8.5 4.25 8.7239 4.25 9C4.25 10.6569 2.90686 12 1.25 12C0.97386 12 0.75 12.2239 0.75 12.5C0.75 12.7761 0.97386 13 1.25 13C2.90686 13 4.25 14.3431 4.25 16C4.25 16.2761 4.47386 16.5 4.75 16.5C5.02614 16.5 5.25 16.2761 5.25 16C5.25 14.3431 6.59314 13 8.25 13C8.5261 13 8.75 12.7761 8.75 12.5C8.75 12.2239 8.5261 12 8.25 12C6.59314 12 5.25 10.6569 5.25 9Z'
        fill='url(#paint5_linear_1210_2658)'
      />
      <path
        d='M5.25 9C5.25 8.7239 5.02614 8.5 4.75 8.5C4.47386 8.5 4.25 8.7239 4.25 9C4.25 10.6569 2.90686 12 1.25 12C0.97386 12 0.75 12.2239 0.75 12.5C0.75 12.7761 0.97386 13 1.25 13C2.90686 13 4.25 14.3431 4.25 16C4.25 16.2761 4.47386 16.5 4.75 16.5C5.02614 16.5 5.25 16.2761 5.25 16C5.25 14.3431 6.59314 13 8.25 13C8.5261 13 8.75 12.7761 8.75 12.5C8.75 12.2239 8.5261 12 8.25 12C6.59314 12 5.25 10.6569 5.25 9Z'
        fill='#73a3ff'
        fillOpacity='0.4'
      />
      <defs>
        <linearGradient
          id='paint0_linear_1210_2658'
          x1='0.75'
          y1='0.5'
          x2='19.2507'
          y2='0.500849'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.0001' stopColor='#73a3ff' />
          <stop offset='0.5001' stopColor='#73a3ff' />
          <stop offset='1' stopColor='#73a3ff' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_1210_2658'
          x1='0.75'
          y1='0.5'
          x2='19.2507'
          y2='0.500849'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.0001' stopColor='#73a3ff' />
          <stop offset='0.5001' stopColor='#73a3ff' />
          <stop offset='1' stopColor='#73a3ff' />
        </linearGradient>
        <linearGradient
          id='paint2_linear_1210_2658'
          x1='0.75'
          y1='0.5'
          x2='19.2507'
          y2='0.500849'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.0001' stopColor='#73a3ff' />
          <stop offset='0.5001' stopColor='#73a3ff' />
          <stop offset='1' stopColor='#73a3ff' />
        </linearGradient>
        <linearGradient
          id='paint3_linear_1210_2658'
          x1='0.75'
          y1='0.5'
          x2='19.2507'
          y2='0.500849'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.0001' stopColor='#73a3ff' />
          <stop offset='0.5001' stopColor='#73a3ff' />
          <stop offset='1' stopColor='#73a3ff' />
        </linearGradient>
        <linearGradient
          id='paint4_linear_1210_2658'
          x1='0.75'
          y1='0.5'
          x2='19.2507'
          y2='0.500849'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.0001' stopColor='#73a3ff' />
          <stop offset='0.5001' stopColor='#73a3ff' />
          <stop offset='1' stopColor='#73a3ff' />
        </linearGradient>
        <linearGradient
          id='paint5_linear_1210_2658'
          x1='0.75'
          y1='0.5'
          x2='19.2507'
          y2='0.500849'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.0001' stopColor='#73a3ff' />
          <stop offset='0.5001' stopColor='#73a3ff' />
          <stop offset='1' stopColor='#73a3ff' />
        </linearGradient>
      </defs>
    </svg>
  ),
  bag: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='currentColor'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.3125 7.5V6.5625C10.3125 5.0092 11.5717 3.75 13.125 3.75H16.875C18.4283 3.75 19.6875 5.0092 19.6875 6.5625V7.5H24.375C25.9283 7.5 27.1875 8.7592 27.1875 10.3125V13.7891C27.1875 14.6054 26.8348 15.363 26.2486 15.8868C26.2495 15.9036 26.25 15.9205 26.25 15.9375V23.4375C26.25 24.9908 24.9908 26.25 23.4375 26.25H6.5625C5.0092 26.25 3.75 24.9908 3.75 23.4375V15.9375C3.75 15.9205 3.75045 15.9036 3.75135 15.8867C3.16524 15.363 2.8125 14.6054 2.8125 13.7891V10.3125C2.8125 8.7592 4.0717 7.5 5.625 7.5H10.3125ZM12.1875 6.5625C12.1875 6.04473 12.6072 5.625 13.125 5.625H16.875C17.3928 5.625 17.8125 6.04473 17.8125 6.5625V7.5H12.1875V6.5625ZM17.7321 19.4205L24.375 16.8108V23.4375C24.375 23.9553 23.9553 24.375 23.4375 24.375H6.5625C6.04473 24.375 5.625 23.9553 5.625 23.4375V16.8108L12.2679 19.4205C12.5687 20.6501 13.6778 21.5625 15 21.5625C16.3222 21.5625 17.4313 20.6501 17.7321 19.4205ZM15.9375 18.7286C15.9372 18.7409 15.9372 18.7532 15.9374 18.7655C15.9291 19.2761 15.5126 19.6875 15 19.6875C14.4874 19.6875 14.0709 19.2761 14.0626 18.7655C14.0628 18.7532 14.0628 18.7409 14.0625 18.7286V17.8125H15.9375V18.7286ZM17.8125 17.3744L24.7178 14.6616C25.0766 14.5207 25.3125 14.1745 25.3125 13.7891V10.3125C25.3125 9.79473 24.8928 9.375 24.375 9.375H5.625C5.10723 9.375 4.6875 9.79473 4.6875 10.3125V13.7891C4.6875 14.1745 4.92343 14.5207 5.2822 14.6616L12.1875 17.3744V16.875C12.1875 16.3572 12.6072 15.9375 13.125 15.9375H16.875C17.3928 15.9375 17.8125 16.3572 17.8125 16.875V17.3744Z'
      />
    </svg>
  ),
  price: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      {...props}
    >
      <g clip-path='url(#clip0_148_118)'>
        <path
          d='M6.89307 7.42756C6.91291 7.24502 6.94324 7.06378 6.98391 6.88472L5.62021 6.68016C5.49946 6.66088 5.3852 6.61259 5.28722 6.53943C5.18924 6.46628 5.11046 6.37045 5.05766 6.26017L4.43882 4.95419C4.42673 4.92342 4.40565 4.89701 4.37833 4.8784C4.35101 4.85978 4.31872 4.84983 4.28567 4.84983C4.25261 4.84983 4.22032 4.85978 4.193 4.8784C4.16568 4.89701 4.1446 4.92342 4.13251 4.95419L3.51424 6.25761C3.46153 6.36854 3.38266 6.46501 3.28441 6.53872C3.18617 6.61243 3.07149 6.66117 2.95025 6.68076L1.57883 6.88647C1.54624 6.89272 1.51604 6.90793 1.49161 6.93039C1.46719 6.95285 1.4495 6.98168 1.44055 7.01363C1.42735 7.05119 1.4248 7.09167 1.43317 7.1306C1.44154 7.16952 1.46051 7.20537 1.48799 7.23419L2.47141 8.23189C2.55791 8.32006 2.6223 8.42747 2.6593 8.54531C2.69629 8.66316 2.70484 8.78809 2.68425 8.90988L2.44997 10.3275C2.4426 10.366 2.4464 10.4059 2.46093 10.4423C2.47546 10.4788 2.50011 10.5103 2.53197 10.5332C2.55538 10.5512 2.58359 10.5618 2.61304 10.5637C2.64249 10.5657 2.67185 10.5588 2.69741 10.544L3.93655 9.86721C4.04377 9.80787 4.16439 9.7769 4.28694 9.77725C4.4095 9.7776 4.52993 9.80926 4.63682 9.86921L5.87364 10.5446C5.89917 10.5591 5.92838 10.5657 5.95765 10.5637C5.98691 10.5617 6.01493 10.5511 6.0382 10.5332C6.07024 10.5101 6.09497 10.4782 6.10945 10.4415C6.12394 10.4047 6.12757 10.3645 6.11992 10.3258L5.88564 8.91035C5.86503 8.78814 5.8737 8.66278 5.91095 8.54457C5.9482 8.42636 6.01297 8.31868 6.09992 8.23036L6.89307 7.42756ZM11.9998 10.5232C12.5039 10.3949 12.8567 9.94106 12.8567 9.42094C12.8567 8.90082 12.5039 8.44695 11.9998 8.31867V10.5232ZM7.85305 2.78675C7.79607 2.72986 7.75176 2.66158 7.72301 2.58637C7.69426 2.51117 7.68173 2.43074 7.68623 2.35035C7.69074 2.26996 7.71218 2.19143 7.74915 2.11991C7.78612 2.04839 7.83779 1.98548 7.90077 1.93532C8.04618 1.81858 8.19353 1.70429 8.34277 1.59248C8.83848 1.22105 9.68731 0.986772 10.2856 1.28533C10.9219 1.60505 11.1059 2.44332 11.1373 3.17387C11.5169 3.12873 11.9004 3.12816 12.2801 3.17215C12.2147 1.36017 11.4478 0.588184 10.7984 0.261907C9.727 -0.270367 8.4193 0.104472 7.65703 0.678183C7.43418 0.845024 7.20731 1.02474 6.99503 1.19874C6.76804 1.38539 6.43651 1.36945 6.22848 1.1619L5.93449 0.86818L5.49505 3.36015L7.98702 2.92071L7.85305 2.78675ZM8.09905 14.0646C7.95351 14.1812 7.80616 14.2955 7.65706 14.4074C7.16163 14.7789 6.31279 15.0129 5.71424 14.7143C5.0734 14.3923 4.89169 13.5449 4.86225 12.8103C4.67101 12.8347 4.47849 12.8478 4.2857 12.8495C4.09666 12.8479 3.90788 12.8355 3.72027 12.8123C3.7817 14.6354 4.5511 15.4123 5.20225 15.738C6.27279 16.2703 7.5805 15.8957 8.3422 15.3223C8.56504 15.1551 8.79192 14.9754 9.00419 14.8014C9.23138 14.6141 9.56372 14.63 9.7719 14.8383L10.0653 15.1317L10.5048 12.6397L8.0128 13.0795L8.14708 13.2134C8.20401 13.2703 8.24828 13.3386 8.27699 13.4138C8.3057 13.489 8.31819 13.5694 8.31366 13.6498C8.30912 13.7301 8.28766 13.8086 8.25068 13.8801C8.21369 13.9516 8.16202 14.0145 8.09905 14.0646ZM10.5713 6.56385C10.5732 7.08338 10.9254 7.53625 11.4284 7.66612V5.46159C10.9254 5.59146 10.5732 6.0443 10.5713 6.56385Z'
          fill='#73a3ff'
        />
        <path
          d='M4.28566 12.278C4.93315 12.2786 5.5723 12.132 6.15485 11.8494C6.7374 11.5668 7.24813 11.1555 7.64846 10.6466C7.18269 9.93619 6.91355 9.11498 6.86847 8.26666L6.50563 8.63238C6.48271 8.65694 6.46586 8.68654 6.45644 8.71879C6.44701 8.75104 6.44527 8.78505 6.45135 8.81809L6.68563 10.2352C6.70927 10.3797 6.69212 10.528 6.63609 10.6632C6.58005 10.7985 6.48737 10.9155 6.36848 11.0009C6.25752 11.0798 6.12664 11.1259 5.99075 11.134C5.85487 11.142 5.71945 11.1118 5.59992 11.0467L4.35994 10.3695C4.33823 10.3558 4.31317 10.3482 4.28748 10.3477C4.26179 10.3472 4.23645 10.3538 4.21422 10.3667L2.9714 11.0467C2.8517 11.1112 2.71638 11.1411 2.58062 11.1331C2.44486 11.125 2.31404 11.0792 2.20284 11.0009C2.08395 10.9155 1.99127 10.7985 1.93524 10.6632C1.8792 10.528 1.86205 10.3797 1.88569 10.2352L2.11997 8.81809C2.12626 8.7855 2.12461 8.75187 2.11516 8.72004C2.10571 8.68822 2.08874 8.65914 2.06569 8.63525L1.08286 7.63527C0.980126 7.53208 0.908498 7.40207 0.876165 7.2601C0.843832 7.11813 0.852098 6.96993 0.900019 6.83243C0.941531 6.70025 1.01918 6.58231 1.12419 6.49194C1.22921 6.40156 1.3574 6.34236 1.49429 6.321L2.86571 6.11529C2.89496 6.1098 2.92245 6.09732 2.94583 6.07891C2.96921 6.0605 2.98779 6.03671 2.99999 6.00957L3.61714 4.70959C3.67527 4.58098 3.76926 4.47187 3.88784 4.39534C4.00642 4.31881 4.14456 4.2781 4.28569 4.2781C4.42682 4.2781 4.56496 4.31881 4.68354 4.39534C4.80212 4.47187 4.89611 4.58098 4.95424 4.70959L5.57139 6.01241C5.58417 6.03887 5.60297 6.06195 5.62629 6.07982C5.64962 6.09768 5.6768 6.10982 5.70567 6.11526L7.07709 6.32097C7.10128 6.325 7.12515 6.33072 7.14853 6.33813C7.27636 5.98676 7.44413 5.65123 7.64852 5.33814C7.24044 4.83793 6.72812 4.4328 6.14731 4.15102C5.56649 3.86925 4.93119 3.71762 4.28572 3.70673C1.91876 3.70673 0 5.62548 0 7.99239C0 10.3593 1.91876 12.278 4.28566 12.278Z'
          fill='#73a3ff'
        />
        <path
          d='M12.517 3.78101C11.9855 3.68101 11.44 3.68101 10.9084 3.78101C8.73651 4.19585 7.23637 6.19454 7.44471 8.39591C7.65305 10.5973 9.50153 12.2791 11.7127 12.2791C13.9239 12.2791 15.7724 10.5973 15.9807 8.39591C16.1891 6.19454 14.6889 4.19585 12.517 3.78101ZM13.4284 9.42093C13.4267 10.2565 12.8235 10.9694 11.9998 11.1095V11.4209C11.9998 11.4967 11.9697 11.5694 11.9162 11.6229C11.8626 11.6765 11.7899 11.7066 11.7141 11.7066C11.6383 11.7066 11.5657 11.6765 11.5121 11.6229C11.4585 11.5694 11.4284 11.4967 11.4284 11.4209V11.1095C10.6047 10.9694 10.0015 10.2565 9.99986 9.42093C9.99986 9.34515 10.03 9.27248 10.0835 9.2189C10.1371 9.16532 10.2098 9.13522 10.2856 9.13522C10.361 9.13624 10.4331 9.16667 10.4865 9.22004C10.5398 9.2734 10.5703 9.34547 10.5713 9.42093C10.573 9.94067 10.9252 10.3938 11.4284 10.5238V8.25238C10.6039 8.11373 10.0001 7.3999 10.0001 6.56384C10.0001 5.72779 10.6039 5.01396 11.4284 4.87531V4.56387C11.4284 4.4881 11.4585 4.41542 11.5121 4.36184C11.5657 4.30826 11.6384 4.27816 11.7142 4.27816C11.7899 4.27816 11.8626 4.30826 11.9162 4.36184C11.9698 4.41542 11.9999 4.4881 11.9999 4.56387V4.87531C12.8236 5.01537 13.4268 5.72829 13.4284 6.56384C13.4284 6.63962 13.3983 6.71229 13.3447 6.76588C13.2911 6.81946 13.2185 6.84956 13.1427 6.84956C13.0669 6.84956 12.9942 6.81946 12.9407 6.76588C12.8871 6.71229 12.857 6.63962 12.857 6.56384C12.8553 6.0441 12.5031 5.59095 11.9998 5.46102V7.73242C12.8236 7.87245 13.4267 8.58538 13.4284 9.42093Z'
          fill='#73a3ff'
        />
      </g>
      <defs>
        <clipPath id='clip0_148_118'>
          <rect width='16' height='16' fill='white' />
        </clipPath>
      </defs>
    </svg>
  ),
  location: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='17'
      height='16'
      viewBox='0 0 17 16'
      fill='none'
      {...props}
    >
      <g clip-path='url(#clip0_148_123)'>
        <path
          d='M15.8333 14.6667H14.5V3.33333C14.5 2.97971 14.3595 2.64057 14.1095 2.39052C13.8594 2.14048 13.5203 2 13.1667 2H3.83333C3.47971 2 3.14057 2.14048 2.89052 2.39052C2.64048 2.64057 2.5 2.97971 2.5 3.33333V14.6667H1.16667C0.989856 14.6667 0.820286 14.7369 0.695262 14.8619C0.570238 14.987 0.5 15.1565 0.5 15.3333C0.5 15.5101 0.570238 15.6797 0.695262 15.8047C0.820286 15.9298 0.989856 16 1.16667 16H15.8333C16.0101 16 16.1797 15.9298 16.3047 15.8047C16.4298 15.6797 16.5 15.5101 16.5 15.3333C16.5 15.1565 16.4298 14.987 16.3047 14.8619C16.1797 14.7369 16.0101 14.6667 15.8333 14.6667ZM5.66667 5H11.3333C11.4659 5 11.5931 5.05268 11.6869 5.14645C11.7807 5.24021 11.8333 5.36739 11.8333 5.5C11.8333 5.63261 11.7807 5.75979 11.6869 5.85355C11.5931 5.94732 11.4659 6 11.3333 6H5.66667C5.53406 6 5.40688 5.94732 5.31311 5.85355C5.21935 5.75979 5.16667 5.63261 5.16667 5.5C5.16667 5.36739 5.21935 5.24021 5.31311 5.14645C5.40688 5.05268 5.53406 5 5.66667 5ZM5.66667 9H11.3333C11.4659 9 11.5931 9.05268 11.6869 9.14645C11.7807 9.24022 11.8333 9.36739 11.8333 9.5C11.8333 9.63261 11.7807 9.75979 11.6869 9.85355C11.5931 9.94732 11.4659 10 11.3333 10H5.66667C5.53406 10 5.40688 9.94732 5.31311 9.85355C5.21935 9.75979 5.16667 9.63261 5.16667 9.5C5.16667 9.36739 5.21935 9.24022 5.31311 9.14645C5.40688 9.05268 5.53406 9 5.66667 9ZM8.23333 12.0133C8.60407 11.9765 8.97841 12.0177 9.33228 12.1342C9.68614 12.2507 10.0117 12.44 10.288 12.69C10.5643 12.9399 10.7852 13.2449 10.9365 13.5853C11.0879 13.9258 11.1663 14.2941 11.1667 14.6667H5.844C5.90067 13.324 6.888 12.144 8.23333 12.0133ZM3.83333 1.33333H13.1667C13.4813 1.33333 13.7753 1.41267 14.04 1.54267L13.1107 0.148667C13.0803 0.102924 13.0391 0.06541 12.9907 0.0394696C12.9423 0.0135292 12.8882 -3.05024e-05 12.8333 5.15209e-08H4.16667C4.11176 -3.05024e-05 4.0577 0.0135292 4.00931 0.0394696C3.96092 0.06541 3.9197 0.102924 3.88933 0.148667L2.96 1.54267C3.23114 1.40667 3.53 1.33504 3.83333 1.33333Z'
          fill='#73a3ff'
        />
      </g>
      <defs>
        <clipPath id='clip0_148_123'>
          <rect
            width='16'
            height='16'
            fill='white'
            transform='translate(0.5)'
          />
        </clipPath>
      </defs>
    </svg>
  ),
  category: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='17'
      height='16'
      viewBox='0 0 17 16'
      fill='none'
      {...props}
    >
      <path
        d='M7.75 2.75V6.25C7.75 6.51522 7.64464 6.76957 7.45711 6.95711C7.26957 7.14464 7.01522 7.25 6.75 7.25H3.25C2.98478 7.25 2.73043 7.14464 2.54289 6.95711C2.35536 6.76957 2.25 6.51522 2.25 6.25V2.75C2.25 2.48478 2.35536 2.23043 2.54289 2.04289C2.73043 1.85536 2.98478 1.75 3.25 1.75H6.75C7.01522 1.75 7.26957 1.85536 7.45711 2.04289C7.64464 2.23043 7.75 2.48478 7.75 2.75ZM13.75 1.75H10.25C9.98478 1.75 9.73043 1.85536 9.54289 2.04289C9.35536 2.23043 9.25 2.48478 9.25 2.75V6.25C9.25 6.51522 9.35536 6.76957 9.54289 6.95711C9.73043 7.14464 9.98478 7.25 10.25 7.25H13.75C14.0152 7.25 14.2696 7.14464 14.4571 6.95711C14.6446 6.76957 14.75 6.51522 14.75 6.25V2.75C14.75 2.48478 14.6446 2.23043 14.4571 2.04289C14.2696 1.85536 14.0152 1.75 13.75 1.75ZM6.75 8.75H3.25C2.98478 8.75 2.73043 8.85536 2.54289 9.04289C2.35536 9.23043 2.25 9.48478 2.25 9.75V13.25C2.25 13.5152 2.35536 13.7696 2.54289 13.9571C2.73043 14.1446 2.98478 14.25 3.25 14.25H6.75C7.01522 14.25 7.26957 14.1446 7.45711 13.9571C7.64464 13.7696 7.75 13.5152 7.75 13.25V9.75C7.75 9.48478 7.64464 9.23043 7.45711 9.04289C7.26957 8.85536 7.01522 8.75 6.75 8.75ZM12 8.75C11.4561 8.75 10.9244 8.91129 10.4722 9.21346C10.0199 9.51563 9.66747 9.94512 9.45933 10.4476C9.25119 10.9501 9.19673 11.5031 9.30284 12.0365C9.40895 12.5699 9.67086 13.06 10.0555 13.4445C10.4401 13.8291 10.9301 14.0911 11.4635 14.1972C11.997 14.3033 12.5499 14.2488 13.0524 14.0407C13.5549 13.8325 13.9844 13.4801 14.2865 13.0278C14.5887 12.5756 14.75 12.0439 14.75 11.5C14.75 10.7707 14.4603 10.0712 13.9445 9.55546C13.4288 9.03973 12.7293 8.75 12 8.75Z'
        fill='#8C8C8C'
      />
    </svg>
  ),
  basic: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='currentColor'
      {...props}
    >
      <path d='M27.8425 12.6187L22.0956 18.2437L23.4362 26.1187C23.4697 26.2945 23.4522 26.4761 23.3857 26.6422C23.3193 26.8084 23.2067 26.952 23.0612 27.0562C22.8922 27.1581 22.6954 27.204 22.4987 27.1874C22.348 27.1852 22.2001 27.1466 22.0675 27.0749L14.9706 23.3249L7.87372 27.0749C7.7255 27.1475 7.56076 27.1796 7.39615 27.1681C7.23154 27.1566 7.07288 27.1018 6.93622 27.0093C6.79077 26.9051 6.67817 26.7615 6.61172 26.5954C6.54527 26.4293 6.52775 26.2476 6.56122 26.0718L7.92059 18.1687L2.17372 12.5437C2.05321 12.4234 1.96772 12.2726 1.92643 12.1075C1.88514 11.9423 1.8896 11.769 1.93934 11.6062C1.9922 11.4378 2.09151 11.2878 2.22585 11.1734C2.36018 11.0589 2.52409 10.9847 2.69872 10.9593L10.63 9.8062L14.155 2.6812C14.2317 2.52269 14.3516 2.38902 14.5008 2.29548C14.65 2.20195 14.8226 2.15234 14.9987 2.15234C15.1748 2.15234 15.3474 2.20195 15.4966 2.29548C15.6458 2.38902 15.7657 2.52269 15.8425 2.6812L19.3862 9.86245L27.3175 11.0156C27.4921 11.041 27.656 11.1152 27.7903 11.2296C27.9247 11.3441 28.024 11.4941 28.0768 11.6624C28.1303 11.8279 28.1367 12.0049 28.0953 12.1738C28.0539 12.3427 27.9664 12.4967 27.8425 12.6187Z' />
    </svg>
  ),
  business: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='currentColor'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.1686 22.3284C13.5628 22.5528 12.9379 22.7214 12.3016 22.8323L11.9658 22.8909L11.6301 22.8323C6.52649 21.9425 2.75391 17.4633 2.75391 12.2799V4.83097L11.9658 0.882324L21.1777 4.83097C21.1777 4.83097 21.1773 12.3917 21.1764 12.4474H19.6712C19.6723 12.3917 19.6727 6.44374 19.6727 6.44374C19.6727 6.25949 19.6187 6.0793 19.5172 5.92551C19.4158 5.77171 19.2714 5.65108 19.102 5.57856L12.3363 2.68162C12.2192 2.63149 12.0931 2.60565 11.9658 2.60566C11.8384 2.60567 11.7123 2.63153 11.5953 2.68168L4.83185 5.57862C4.66251 5.65115 4.51819 5.77179 4.41676 5.92557C4.31533 6.07935 4.26126 6.25952 4.26126 6.44374V12.2799C4.26126 16.6964 7.4615 20.5275 11.7944 21.3303C11.9077 21.3513 12.0239 21.3513 12.1372 21.3303C12.8365 21.2009 13.5183 20.9901 14.1686 20.7022V22.3284ZM14.1686 19.6615C13.4734 20.0128 12.7317 20.2631 11.9658 20.4049C8.07591 19.6841 5.20244 16.2449 5.20244 12.2799V6.44374L11.9658 3.54685L18.7316 6.44374C18.7316 6.44374 18.731 12.3917 18.7298 12.4474H15.1097C14.5899 12.4474 14.1686 12.8689 14.1686 13.3886V19.6615ZM7.97026 12.571L10.1911 14.7917C10.5784 15.1814 11.2076 15.1814 11.5949 14.7917C13.5011 12.8879 14.0716 12.2916 15.9661 10.3783C16.3511 9.99097 16.3511 9.36415 15.9614 8.9768C15.5741 8.5918 14.9473 8.59415 14.5623 8.9815L10.893 12.686L9.37408 11.1671C8.98438 10.7797 8.35761 10.7797 7.97026 11.1671C7.58055 11.5544 7.58055 12.1836 7.97026 12.571ZM25.279 13.3886L27.2458 15.3554H25.279V13.3886ZM27.2458 16.2966V29.1176H15.1097V13.3886H24.3378V15.3554C24.3378 15.8753 24.7592 16.2966 25.279 16.2966H27.2458ZM21.5189 18.7474H23.7068C23.9666 18.7474 24.1774 18.5365 24.1774 18.2768C24.1774 18.0171 23.9666 17.8062 23.7068 17.8062H21.5189C21.2591 17.8062 21.0483 18.0171 21.0483 18.2768C21.0483 18.5365 21.2591 18.7474 21.5189 18.7474ZM17.7065 16.5379C17.6455 16.5381 17.587 16.5623 17.5439 16.6055C17.5008 16.6486 17.4765 16.707 17.4763 16.768V18.532C17.4765 18.593 17.5008 18.6515 17.5439 18.6946C17.587 18.7378 17.6455 18.7621 17.7065 18.7622H19.4704C19.5314 18.7621 19.5899 18.7378 19.633 18.6946C19.6762 18.6515 19.7005 18.593 19.7006 18.532V16.768C19.7005 16.707 19.6762 16.6486 19.633 16.6055C19.5899 16.5623 19.5314 16.5381 19.4704 16.5379H17.7065ZM17.7068 23.9291C17.5801 23.9291 17.4767 24.0333 17.4767 24.16V25.9233C17.4769 25.9843 17.5011 26.0428 17.5442 26.0859C17.5874 26.129 17.6458 26.1533 17.7068 26.1534H19.4701C19.5311 26.1533 19.5896 26.129 19.6327 26.0859C19.6758 26.0428 19.7001 25.9843 19.7003 25.9233V24.16C19.7003 24.0333 19.5968 23.9291 19.4701 23.9291H17.7068ZM21.5189 17.3907H24.8799C25.1396 17.3907 25.3505 17.1799 25.3505 16.9201C25.3505 16.6604 25.1396 16.4496 24.8799 16.4496H21.5189C21.2591 16.4496 21.0483 16.6604 21.0483 16.9201C21.0483 17.1799 21.2591 17.3907 21.5189 17.3907ZM21.5189 26.1858H23.7068C23.9666 26.1858 24.1774 25.9749 24.1774 25.7152C24.1774 25.4554 23.9666 25.2446 23.7068 25.2446H21.5189C21.2591 25.2446 21.0483 25.4554 21.0483 25.7152C21.0483 25.9749 21.2591 26.1858 21.5189 26.1858ZM21.5189 24.8291H24.8799C25.1396 24.8291 25.3505 24.6183 25.3505 24.3586C25.3505 24.0989 25.1396 23.888 24.8799 23.888H21.5189C21.2591 23.888 21.0483 24.0989 21.0483 24.3586C21.0483 24.6183 21.2591 24.8291 21.5189 24.8291ZM21.5189 22.4661H23.7068C23.9666 22.4661 24.1774 22.2553 24.1774 21.9956C24.1774 21.7358 23.9666 21.525 23.7068 21.525H21.5189C21.2591 21.525 21.0483 21.7358 21.0483 21.9956C21.0483 22.2553 21.2591 22.4661 21.5189 22.4661ZM21.5189 21.1095H24.8799C25.1396 21.1095 25.3505 20.8986 25.3505 20.6389C25.3505 20.3792 25.1396 20.1683 24.8799 20.1683H21.5189C21.2591 20.1683 21.0483 20.3792 21.0483 20.6389C21.0483 20.8986 21.2591 21.1095 21.5189 21.1095ZM17.7065 20.2333C17.6455 20.2334 17.587 20.2577 17.5439 20.3009C17.5008 20.344 17.4765 20.4024 17.4763 20.4634V22.2274C17.4765 22.2884 17.5008 22.3469 17.5439 22.39C17.587 22.4331 17.6455 22.4574 17.7065 22.4576H19.4704C19.5314 22.4574 19.5899 22.4331 19.633 22.39C19.6762 22.3469 19.7005 22.2884 19.7006 22.2274V20.4634C19.7005 20.4024 19.6762 20.344 19.633 20.3009C19.5899 20.2577 19.5314 20.2334 19.4704 20.2333H17.7065Z'
      />
    </svg>
  ),
  advanced: (props: LucideProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='currentColor'
      {...props}
    >
      <g clip-path='url(#clip0_676_1243)'>
        <path d='M9.34859 9.08428C8.95471 8.63429 8.45031 8.3032 7.85331 8.1976C7.15662 8.07408 6.45912 8.23104 5.88431 8.63342C5.50496 8.89852 5.20223 9.25897 5.00665 9.67841L3.07795 13.8163L7.6277 13.4191C8.08777 13.3778 8.52905 13.2169 8.90773 12.9523C9.94723 12.2234 10.2999 10.8735 9.81586 9.75045L11.7669 12.5328L17.7412 7.92958C20.3674 6.08329 22.1151 3.33181 22.6607 0.181409C19.5581 -0.361648 16.2718 0.377735 13.6925 2.17184L7.72516 6.76908L9.34859 9.08428ZM16.2467 3.52263L17.2548 4.96227L15.8151 5.96949L14.807 4.52985L16.2467 3.52263ZM22.9593 12.9439V28.2361H21.2022V14.1605L12.4168 20.2005V28.2361H10.6597V21.3999L0 29.9932H29.9876V8.11794L22.9593 12.9439ZM3.78658 5.79619L3.78746 5.79876L3.90618 5.71372L3.91274 5.72327C4.6926 5.19509 5.66146 5.15543 6.46708 5.52091L12.0763 1.19958C10.6222 0.264344 8.68734 0.238398 7.18667 1.28849L2.14019 4.82329L3.15427 6.25777L3.78658 5.79619ZM10.9917 15.7862L10.9376 15.8317L10.2169 16.3233L11.207 17.775L16.2415 14.2548L16.2432 14.2531C17.6797 13.2424 18.3199 11.5284 18.0497 9.90824L11.8283 14.704C11.6519 15.1172 11.3769 15.495 10.9917 15.7862Z' />
      </g>
      <defs>
        <clipPath id='clip0_676_1243'>
          <rect width='30' height='30' fill='white' />
        </clipPath>
      </defs>
    </svg>
  ),
};
