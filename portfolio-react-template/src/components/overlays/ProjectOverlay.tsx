import React from 'react';

interface ProjectOverlayProps {
  onClose: () => void;
  isVisible: boolean;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 pt-[84px] px-6 md:px-8 pb-6">
      {/* Dim + vignette */}
      <div className="bg-black absolute top-0 right-0 bottom-0 left-0 backdrop-blur-xl"></div>

      {/* App container */}
      <div className="z-10 relative">
        <div className="overflow-hidden h-[calc(100vh-84px-24px)] flex flex-col bg-neutral-900/80 ring-white/20 ring-1 bg-black/30 rounded-2xl shadow-[0_20px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
          {/* Desktop chrome */}
          <div className="flex sm:px-6 border-white/5 border-b pt-3 pr-4 pb-3 pl-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500/90"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-amber-400/90"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/90"></span>
              </div>
              <a href="#" className="group flex items-center gap-2 text-white/80 ring-transparent ring-1 rounded-lg pt-1 pr-4 pb-1 pl-4">
                <div className="inline-flex bg-center w-8 h-8 bg-[url(https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/logo_dark.png)] bg-cover rounded-md items-center justify-center">
                </div>
                <div className="flex">
                  <span className="text-sm text-white/80 font-geist">Aether</span>
                  <span className="hidden lg:inline text-sm text-white/50 font-geist">:AI Design System Generator</span>
                </div>
              </a>
            </div>

            {/* Top search / actions */}
            <div className="flex gap-2 sm:gap-3 gap-x-2 gap-y-2 items-center">
              <button
                onClick={onClose}
                className="inline-flex active:scale-95 flex-shrink-0 text-sm bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="x" className="lucide lucide-x lucide-sparkles w-[16px] h-[16px] text-white/80">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="hidden lg:inline text-white/80">Close Agent</span>
                <span className="inline lg:hidden text-white/80">Close</span>
              </button>
              <div className="hidden md:flex bg-black/30 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="search" className="lucide lucide-search w-4 h-4 text-white/50">
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <input placeholder="Search projects..." className="w-48 bg-transparent text-sm focus:outline-none" />
              </div>
              <button className="inline-flex md:hidden gap-2 text-sm bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center" id="toggleSidebar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="menu" className="lucide lucide-menu text-white/80">
                  <path d="M4 5h16"></path>
                  <path d="M4 12h16"></path>
                  <path d="M4 19h16"></path>
                </svg>
                Menu
              </button>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-12 flex-1 min-h-0">
            {/* Sidebar */}
            <aside className="hidden md:block md:col-span-3 lg:col-span-3 min-h-0 h-full border-white/5 border-r" id="sidebar">
              <div className="flex flex-col h-[81%] pt-6 pr-3 pb-8 pl-4 space-y-6">
                <div className="">
                  <h1 className="text-l font-semibold text-white tracking-tight">
                    <div className="relative inline-block">
                      <details className="relative">
                        <summary className="inline-flex hover:bg-white/10 hover:ring-white/20 cursor-pointer select-none active:scale-95 bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center" style={{ listStyle: 'none' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="layout-dashboard" className="lucide lucide-layout-dashboard flex-shrink-0">
                            <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                            <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                            <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                            <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                          </svg>
                          <span className="text-xs lg:text-sm text-white">Product Design</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="chevron-down" className="lucide lucide-chevron-down w-[16px] h-[16px]">
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </summary>
                        <ul className="absolute left-0 mt-2 min-w-[14rem] rounded-xl bg-black/80 ring-1 ring-white/10 backdrop-blur-md p-1 shadow-xl z-50">
                          <li>
                            <a href="#" className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 text-sm text-white/80 active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="layout-dashboard" className="lucide lucide-layout-dashboard flex-shrink-0">
                                <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                                <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                                <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                                <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                              </svg>
                              Product Design
                            </a>
                          </li>
                          <li>
                            <a href="#" className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 text-sm text-white/80 active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="pencil-ruler" className="lucide lucide-pencil-ruler flex-shrink-0">
                                <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"></path>
                                <path d="m8 6 2-2"></path>
                                <path d="m18 16 2-2"></path>
                                <path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"></path>
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                <path d="m15 5 4 4"></path>
                              </svg>
                              Logo Design &amp; Branding
                            </a>
                          </li>
                          <li>
                            <a href="#" className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 text-sm text-white/80 active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="circle-play" className="lucide lucide-circle-play flex-shrink-0">
                                <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                              Interaction Design
                            </a>
                          </li>
                        </ul>
                      </details>
                    </div>
                  </h1>
                </div>

                <nav className="overflow-y-auto space-y-6">
                  <div className="space-y-3">
                    <div className="pr-1 pl-2 space-y-5">
                      <ul className="space-y-1">
                        <p className="uppercase text-xs text-white/50 tracking-wider mb-2">Personal Projects</p>
                        <li className="">
                          <a href="#" className="group flex items-top gap-2 active:scale-95 text-sm text-white/80 bg-white/10 ring-white/10 ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 relative">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[24px] flex-shrink-0" strokeWidth="2">
                              <path d="M10.2241 11.9917H13.7759L13.7593 6.66943C10.9046 6.66943 10.2241 8.79171 10.2241 10.6819V11.9917ZM11.1535 4H20V20H13.7759V14.6611H10.2241V20H4V11.4446C4 6.13886 7.56846 4 11.1535 4Z"></path>
                            </svg>
                            <div className="flex flex-col">
                              <span className="lg:text-base text-sm text-white">Aether</span>
                              <span className="lg:text-sm text-xs text-white/50">AI Design System Generator</span>
                            </div>
                          </a>
                        </li>

                        <li className="">
                          <a href="#" className="group flex items-top gap-2 hover:bg-white/10 hover:ring-white/5 active:scale-95 text-sm text-white/80 ring-transparent ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 relative">
                            <svg width="16" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-[16px] h-[28px]" strokeWidth="2">
                              <path d="M12.7015 8.42741C12.568 9.80146 12.0496 11.0571 11.2605 12.0761C10.6512 12.8629 9.88025 13.5083 9.00001 13.9579C8.11977 13.5083 7.34877 12.8629 6.73952 12.0761C5.9487 11.0552 5.42992 9.7964 5.29769 8.41884C5.29727 8.41489 5.29706 8.41116 5.29664 8.4072C5.29558 8.39578 5.29453 8.38436 5.29348 8.37294C5.29833 8.38327 5.30318 8.39337 5.30803 8.40369C5.30929 8.40632 5.31056 8.40896 5.31182 8.4116C5.7123 9.24564 6.36625 9.92465 7.16825 10.3395C7.71972 10.6247 8.3412 10.7851 8.99853 10.7851C9.65586 10.7851 10.279 10.6243 10.8311 10.3384C11.6217 9.9286 12.2683 9.26233 12.6696 8.44366C12.6802 8.43839 12.6909 8.4329 12.7015 8.42741Z"></path>
                              <path d="M12.6696 8.44366C12.2683 9.26233 11.6217 9.9286 10.8311 10.3384C10.279 10.6243 9.65692 10.7851 8.99853 10.7851C8.34015 10.7851 7.71972 10.6247 7.16825 10.3395C6.36625 9.92465 5.7123 9.24564 5.31182 8.4116C5.32806 8.40303 5.3443 8.39469 5.36075 8.38656C5.53305 8.30026 5.71209 8.22603 5.89682 8.16498C6.29034 8.03498 6.70937 7.96471 7.14422 7.96471C7.81188 7.96471 8.44222 8.13007 9.00001 8.42367C9.55738 8.71662 10.1877 8.88176 10.8545 8.88176C11.5214 8.88176 12.122 8.72431 12.6696 8.44366Z"></path>
                              <path d="M12.7023 8.41884C12.7019 8.4217 12.7017 8.42455 12.7015 8.42741C12.6909 8.4329 12.6802 8.43839 12.6696 8.44366C12.122 8.72431 11.506 8.88176 10.8545 8.88176C10.2031 8.88176 9.55738 8.71662 9.00001 8.42367C9.5576 8.13007 10.1884 7.96471 10.8558 7.96471C11.2907 7.96471 11.7097 8.03498 12.1032 8.16498C12.2879 8.22603 12.467 8.30026 12.6393 8.38656C12.6547 8.39425 12.6707 8.40215 12.6859 8.41028C12.6914 8.41313 12.6969 8.41599 12.7023 8.41884Z"></path>
                              <path d="M9.98685 5.93712C9.98685 6.50442 9.54944 6.96431 9.00987 6.96431C8.4703 6.96431 8.0329 6.50442 8.0329 5.93712C8.0329 5.36981 8.4703 4.90992 9.00987 4.90992C9.54944 4.90992 9.98685 5.36981 9.98685 5.93712Z"></path>
                              <path d="M17.9998 4.90272L18 4.92172C18 7.97023 16.8348 10.7352 14.9432 12.7593C14.2681 13.4818 13.5003 14.1101 12.66 14.6226C11.6166 15.2597 10.4615 15.7189 9.23241 15.9607C9.16918 15.9731 9.10567 15.9849 9.04199 15.9963C9.0142 16.0012 8.9858 16.0012 8.95801 15.9963C8.89433 15.9849 8.83082 15.9731 8.76759 15.9607C7.53852 15.7189 6.38342 15.2597 5.33999 14.6226C4.49968 14.1101 3.73186 13.4818 3.05675 12.7593C1.16522 10.7352 0 7.97023 0 4.92172V4.90283C0 4.88175 0 4.86067 0 4.83959C0.000421417 4.73571 0.0023178 4.63206 0.00568913 4.52885C0.0185424 4.11797 0.0526772 3.71281 0.106619 3.31445C0.283614 2.52169 0.671739 1.81303 1.20546 1.25656C1.95053 0.480269 2.97963 0 4.11619 0C4.99548 0 5.81071 0.287459 6.4795 0.777171C6.9182 1.09823 7.29389 1.50625 7.58362 1.9773C7.6091 2.0186 7.63389 2.06041 7.658 2.10269C7.71991 2.21129 7.69148 2.3492 7.59936 2.43132C7.58599 2.44323 7.57267 2.4552 7.55938 2.46723C7.44223 2.57351 7.32866 2.68375 7.21909 2.79817C7.15166 2.86844 7.08571 2.94003 7.02123 3.01338C5.93208 4.2493 5.26751 5.89785 5.26751 7.70824V7.71988C5.26751 7.94014 5.27741 8.15799 5.29658 8.37298C5.29764 8.3844 5.29869 8.39582 5.29974 8.40724C5.30017 8.41119 5.30038 8.41492 5.3008 8.41888C5.43291 9.79644 5.95126 11.0552 6.74141 12.0761C7.32438 12.8297 8.05558 13.4535 8.88891 13.8998C8.95864 13.9371 9.04136 13.9371 9.11109 13.8998C9.94442 13.4535 10.6756 12.8297 11.2586 12.0761C12.0471 11.0572 12.565 9.80149 12.6984 8.42744C12.6986 8.42459 12.6988 8.42173 12.6992 8.41888C12.6996 8.41492 12.6998 8.41119 12.7003 8.40724C12.7015 8.39318 12.7028 8.37913 12.704 8.36507C12.7228 8.15272 12.7325 7.93751 12.7325 7.71988V7.70824C12.7325 5.6172 11.8458 3.74223 10.4427 2.4692C10.4288 2.45656 10.4148 2.44396 10.4007 2.43142C10.3086 2.34922 10.2801 2.21123 10.3421 2.10258C10.5183 1.79346 10.7307 1.50934 10.9731 1.25656C11.1416 1.08088 11.3247 0.920351 11.5205 0.777171C11.677 0.662559 11.842 0.558874 12.0137 0.467313C12.5748 0.168685 13.2106 0 13.8838 0C15.8348 0 17.4687 1.41462 17.... [truncated]
    </path>
    <path d="M7.54803 2.45667C7.43023 2.56305 7.31626 2.67384 7.20589 2.78839C7.13818 2.85879 7.07175 2.93074 7.00723 3.00424C5.93538 4.21789 5.27169 5.82683 5.24155 7.59688C5.2407 7.55473 5.24028 7.51257 5.24028 7.47042V7.4585C5.24028 5.61407 5.92838 3.93672 7.05222 2.68885C7.09149 2.667 7.13139 2.64581 7.1715 2.62551C7.29376 2.56283 7.41941 2.50633 7.54803 2.45667Z" class="">
    </path>
    <path d="M7.54397 2.43287C7.55334 2.43113 7.56299 2.43556 7.56799 2.44434C7.5737 2.4544 7.5717 2.46729 7.56323 2.47494C7.46053 2.56768 7.36075 2.66382 7.2637 2.76288L7.22228 2.80552C7.1548 2.87569 7.08862 2.94737 7.02437 3.02056C5.9729 4.21114 5.31554 5.78341 5.26661 7.51476L5.26475 7.5973C5.26453 7.61047 5.25423 7.62103 5.24159 7.62105C5.23052 7.62107 5.2212 7.61301 5.21889 7.60217L5.21834 7.5974C5.21749 7.55507 5.21707 7.51275 5.21707 7.47043V7.45848C5.21708 5.60767 5.90759 3.92447 7.03529 2.67232L7.0381 2.66967L7.04127 2.66755C7.0808 2.64555 7.12099 2.62419 7.16137 2.60376C7.28428 2.54074 7.41064 2.48394 7.53998 2.434L7.54397 2.43287ZM7.54803 2.45667C7.41941 2.50633 7.29376 2.56283 7.1715 2.62551L7.11156 2.65659C7.09166 2.66716 7.07186 2.67792 7.05222 2.68885L6.99985 2.74768C5.90704 3.98919 5.24028 5.64291 5.24028 7.4585V7.47042C5.24028 7.51257 5.2407 7.55473 5.24155 7.59688C5.27122 5.85448 5.9148 4.2682 6.95729 3.0614L7.00723 3.00424C7.05561 2.94913 7.10508 2.89488 7.15534 2.8415L7.20589 2.78839C7.31626 2.67384 7.43023 2.56305 7.54803 2.45667Z" class="">
    </path>
    <path d="M12.7597 7.4585V7.47042C12.7597 7.51258 12.7593 7.55473 12.7585 7.59688C12.7237 5.54676 11.8384 3.71226 10.4541 2.45866C10.6254 2.52531 10.7912 2.60344 10.9508 2.69216C12.0729 3.93959 12.7597 5.61562 12.7597 7.4585Z" class="">
    </path>
    <path d="M10.4342 2.44628C10.4399 2.43625 10.4517 2.43191 10.4622 2.43599C10.6129 2.49464 10.7594 2.56213 10.9012 2.63785L10.9617 2.67081L10.9649 2.67298L10.9677 2.67563C12.0937 3.92735 12.7829 5.60922 12.7829 7.45848V7.47043C12.7829 7.49158 12.7828 7.51274 12.7826 7.53389L12.7817 7.5974C12.7814 7.61056 12.7711 7.62108 12.7584 7.62106C12.7458 7.62104 12.7355 7.61047 12.7353 7.59731C12.7011 5.58625 11.8458 3.78341 10.5032 2.53591L10.4389 2.47688C10.4304 2.46921 10.4284 2.45633 10.4342 2.44628ZM10.4541 2.45866C11.8384 3.71226 12.7237 5.54676 12.7585 7.59688C12.7593 7.55473 12.7597 7.51258 12.7597 7.47042V7.4585C12.7597 5.64442 12.0942 3.99199 11.003 2.75094L10.9508 2.69216C10.7912 2.60344 10.6254 2.52531 10.4541 2.45866Z" class="">
    </path>
  </svg>
  <div class="flex flex-col">
    <span class="lg:text-base text-sm text-white">Lalaverse</span>
    <span class="text-xs lg:text-sm text-white/50">Customised VR solutions</span>
  </div>
</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>



          <div class="space-y-1"></div>
        </nav>
      </div>

      <!-- Profile card -->
      <div class="sm:p-6 border-white/10 border-t pt-4 pr-4 pb-4 pl-4">
        <div class="flex items-center gap-3 rounded-xl bg-black/80 p-3 ring-1 ring-white/10">
          <div class="inline-flex transition active:scale-95 text-white/80 bg-white/10 w-9 h-9 rounded-md ring-white/5 ring-1 items-center justify-center flex-shrink-0" alt="AI Agent">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-lucide="copyright" className="lucide lucide-copyright lucide-train-front lucide-circle-user lucide-user w-[20px] h-[20px] text-white/80 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M14.83 14.83a4 4 0 1 1 0-5.66"></path>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs lg:text-sm font-medium text-white">Vansh Grover, 2025</p>
            <p className="hidden lg:inline text-xs text-white/50">Created by Vansh Grover (and team)</p>
          </div>

        </div>
      </div>
    </aside>

    {/* Main stage */}
    <section className="col-span-12 md:col-span-9 lg:col-span-9 min-h-0 flex flex-col relative" id="main-content">
      <div className="flex flex-col min-h-0 h-full relative">
        {/* Project Area */}
        <div className="flex-1 sm:space-y-6">
          {/* Project Iframe */}
          <iframe src="https://www.vansh.fyi/projects/personal/aether" className="w-full h-full border-0" title="Description of the iframe content">
          </iframe>
        </div>
      </div>
    </section>
  </div>
</div>
    </div>
  );
};

export default ProjectOverlay;
